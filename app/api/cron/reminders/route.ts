import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { HabitModel, UserModel } from "@/lib/models"
import { sendEmail } from "@/lib/email"
import { createNotification } from "@/lib/notifications"
import { sendPushNotification } from "@/lib/push-notifications"

export async function GET(request: Request) {
  // Verify cron secret to ensure this is called by a trusted source
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    await connectToDatabase()

    // Get current time in HH:MM format
    const now = new Date()
    const currentHour = now.getHours().toString().padStart(2, "0")
    const currentMinute = now.getMinutes().toString().padStart(2, "0")
    const currentTime = `${currentHour}:${currentMinute}`

    // Find habits with reminders enabled for the current time
    const habits = await HabitModel.find({
      reminderEnabled: true,
      reminderTime: currentTime,
      completedToday: false, // Only remind for habits not completed today
    }).lean()

    // Send reminders for each habit
    for (const habit of habits) {
      const user = await UserModel.findOne({ clerkId: habit.userId }).lean()

      if (!user) continue

      // Create in-app notification
      await createNotification({
        userId: habit.userId,
        title: "Habit Reminder",
        message: `Don't forget to complete your habit: ${habit.name}`,
        type: "reminder",
      })

      // Send email reminder
      if (user.email) {
        await sendEmail({
          to: user.email,
          subject: "Habit Reminder",
          text: `Don't forget to complete your habit: ${habit.name}`,
        })
      }

      // Send push notification if subscribed
      if (user.pushSubscription) {
        await sendPushNotification(
          habit.userId,
          "Habit Reminder",
          `Don't forget to complete your habit: ${habit.name}`,
          "/",
        )
      }
    }

    return NextResponse.json({
      success: true,
      remindersProcessed: habits.length,
    })
  } catch (error) {
    console.error("Failed to process reminders:", error)
    return NextResponse.json({ success: false, error: "Failed to process reminders" }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"

