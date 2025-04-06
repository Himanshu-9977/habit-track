export interface Habit {
  _id: string
  userId: string
  name: string
  description?: string
  frequency: "daily" | "weekly"
  currentStreak: number
  bestStreak: number
  completedToday: boolean
  completedDates: Date[]
  reminderEnabled: boolean
  reminderTime?: string
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  _id: string
  userId: string
  title: string
  message: string
  type: "reminder" | "streak" | "system"
  read: boolean
  createdAt: Date
  updatedAt: Date
}

export interface User {
  _id: string
  clerkId: string
  email: string
  firstName: string
  lastName: string
  pushSubscription?: {
    endpoint: string
    expirationTime: number | null
    keys: {
      p256dh: string
      auth: string
    }
  }
  createdAt: Date
  updatedAt: Date
}

export interface Stats {
  totalHabits: number
  activeHabits: number
  completionRate: number
  currentStreak: number
  bestStreak: number
  streakData: StreakData[]
}

export interface StreakData {
  day: string
  completed: boolean
  completedCount: number
  missedCount: number
}

