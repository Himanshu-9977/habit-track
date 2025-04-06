"use server"

import { connectToDatabase } from "@/lib/db"
import { HabitModel } from "@/lib/models"
import type { Habit, Stats, StreakData } from "@/lib/types"
import { revalidatePath } from "next/cache"
import { format, subDays, startOfDay, endOfDay, isToday } from "date-fns"
import { createNotification } from "@/lib/notifications"
import { sendEmail } from "@/lib/email"
import { auth } from "@clerk/nextjs/server"
import { getUserByClerkId } from "@/lib/user"

export async function getHabits(userId: string): Promise<Habit[]> {
  await connectToDatabase()

  const habits = await HabitModel.find({ userId }).sort({ createdAt: -1 }).lean()

  // Check if habits need to be reset for the day
  const updatedHabits = await Promise.all(
    habits.map(async (habit) => {
      const lastCompletedDate =
        habit.completedDates.length > 0 ? new Date(habit.completedDates[habit.completedDates.length - 1]) : null

      // If the habit was completed yesterday, keep the streak
      // If not completed yesterday and completedToday is true, reset it
      if (habit.completedToday && lastCompletedDate && !isToday(lastCompletedDate)) {
        await HabitModel.updateOne({ _id: habit._id }, { $set: { completedToday: false } })
        habit.completedToday = false
      }

      return habit
    }),
  )

  return updatedHabits
}

export async function getHabitById(habitId: string, userId: string): Promise<Habit | null> {
  await connectToDatabase()

  const habit = await HabitModel.findOne({
    _id: habitId,
    userId,
  }).lean()

  return habit
}

export async function createHabit(data: Partial<Habit>) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  await connectToDatabase()

  const newHabit = new HabitModel({
    userId,
    name: data.name,
    description: data.description || "",
    frequency: data.frequency || "daily",
    currentStreak: 0,
    bestStreak: 0,
    completedToday: false,
    completedDates: [],
    reminderEnabled: data.reminderEnabled || false,
    reminderTime: data.reminderTime || "",
  })

  await newHabit.save()

  // Create a welcome notification
  await createNotification({
    userId,
    title: "New Habit Created",
    message: `You've created a new habit: ${data.name}. Keep it up!`,
    type: "system",
  })

  revalidatePath("/")
}

export async function updateHabit(habitId: string, data: Partial<Habit>) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  await connectToDatabase()

  await HabitModel.updateOne(
    { _id: habitId, userId },
    {
      $set: {
        name: data.name,
        description: data.description,
        frequency: data.frequency,
        reminderEnabled: data.reminderEnabled,
        reminderTime: data.reminderTime,
      },
    },
  )

  revalidatePath("/")
}

export async function deleteHabit(formData: FormData) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  await connectToDatabase()

  const habitId = formData.get("habitId") as string

  await HabitModel.deleteOne({ _id: habitId, userId })

  revalidatePath("/")
}

export async function logHabit(formData: FormData) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  await connectToDatabase()

  const habitId = formData.get("habitId") as string

  const habit = await HabitModel.findOne({ _id: habitId, userId })

  if (!habit) {
    throw new Error("Habit not found")
  }

  // If already completed today, do nothing
  if (habit.completedToday) {
    return
  }

  const today = new Date()
  const lastCompletedDate =
    habit.completedDates.length > 0 ? new Date(habit.completedDates[habit.completedDates.length - 1]) : null

  let newStreak = habit.currentStreak

  // Check if the last completion was yesterday or today
  if (!lastCompletedDate || today.getTime() - lastCompletedDate.getTime() <= 86400000 * 2) {
    newStreak += 1
  } else {
    // Streak broken
    newStreak = 1
  }

  const bestStreak = Math.max(newStreak, habit.bestStreak)

  // Update the habit
  await HabitModel.updateOne(
    { _id: habitId },
    {
      $set: {
        completedToday: true,
        currentStreak: newStreak,
        bestStreak: bestStreak,
      },
      $push: { completedDates: today },
    },
  )

  // Create milestone notifications
  if (newStreak === 7) {
    await createNotification({
      userId,
      title: "One Week Streak! 🎉",
      message: `You've completed "${habit.name}" for 7 days in a row. Great job!`,
      type: "streak",
    })
  } else if (newStreak === 30) {
    await createNotification({
      userId,
      title: "One Month Streak! 🏆",
      message: `Amazing! You've maintained "${habit.name}" for 30 days straight.`,
      type: "streak",
    })

    // Get user email from Clerk
    const user = await getUserByClerkId(userId)

    if (user && user.email) {
      // Send a congratulatory email for 30-day streak
      await sendEmail({
        to: user.email,
        subject: "Congratulations on Your 30-Day Streak!",
        text: `You've completed "${habit.name}" for 30 days in a row. That's a huge achievement!`,
      })
    }
  }

  revalidatePath("/")
}

export async function getStats(userId: string): Promise<Stats> {
  await connectToDatabase()

  const habits = await HabitModel.find({ userId }).lean()

  const totalHabits = habits.length
  const activeHabits = habits.filter((h) => h.completedDates.length > 0).length

  // Calculate completion rate for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i)
    return {
      start: startOfDay(date),
      end: endOfDay(date),
    }
  })

  let totalCompletions = 0
  let possibleCompletions = 0

  habits.forEach((habit) => {
    last7Days.forEach((day) => {
      possibleCompletions++

      const completed = habit.completedDates.some((date) => {
        const completedDate = new Date(date)
        return completedDate >= day.start && completedDate <= day.end
      })

      if (completed) {
        totalCompletions++
      }
    })
  })

  const completionRate = possibleCompletions > 0 ? Math.round((totalCompletions / possibleCompletions) * 100) : 0

  // Get the highest current streak and best streak
  const currentStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak), 0)
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.bestStreak), 0)

  // Generate streak data for the chart (last 7 days)
  const streakData: StreakData[] = last7Days.reverse().map((day) => {
    const dayStr = format(day.start, "EEE")

    // Count completed habits for this day
    let completedCount = 0;
    let missedCount = 0;

    habits.forEach((habit) => {
      // Only count habits that existed before or on this day
      const habitCreatedAt = new Date(habit.createdAt);
      if (habitCreatedAt <= day.end) {
        const isCompleted = habit.completedDates.some((date) => {
          const completedDate = new Date(date)
          return completedDate >= day.start && completedDate <= day.end
        });

        if (isCompleted) {
          completedCount++;
        } else {
          missedCount++;
        }
      }
    });

    return {
      day: dayStr,
      completed: completedCount > 0,
      completedCount,
      missedCount
    }
  })

  return {
    totalHabits,
    activeHabits,
    completionRate,
    currentStreak,
    bestStreak,
    streakData,
  }
}

// Server action to get analytics data for client components
export async function getAnalyticsData() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const stats = await getStats(userId)
  return stats
}

