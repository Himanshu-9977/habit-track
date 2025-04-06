import mongoose, { Schema } from "mongoose"
import type { Habit, Notification, User } from "./types"

// User Schema
const UserSchema = new Schema<User>(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    pushSubscription: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
)

// Habit Schema
const HabitSchema = new Schema<Habit>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    frequency: { type: String, enum: ["daily", "weekly"], default: "daily" },
    currentStreak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    completedToday: { type: Boolean, default: false },
    completedDates: [{ type: Date }],
    reminderEnabled: { type: Boolean, default: false },
    reminderTime: { type: String },
  },
  { timestamps: true },
)

// Notification Schema
const NotificationSchema = new Schema<Notification>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["reminder", "streak", "system"], default: "system" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
)

// Export models
export const UserModel = mongoose.models.User || mongoose.model<User>("User", UserSchema)
export const HabitModel = mongoose.models.Habit || mongoose.model<Habit>("Habit", HabitSchema)
export const NotificationModel =
  mongoose.models.Notification || mongoose.model<Notification>("Notification", NotificationSchema)

