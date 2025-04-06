"use server"

import { connectToDatabase } from "@/lib/db"
import { NotificationModel } from "@/lib/models"
import type { Notification } from "@/lib/types"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"

export async function getNotifications(userId: string): Promise<Notification[]> {
  await connectToDatabase()

  const notifications = await NotificationModel.find({ userId }).sort({ createdAt: -1 }).limit(50).lean()

  return notifications
}

export async function createNotification(data: Partial<Notification>) {
  await connectToDatabase()

  const newNotification = new NotificationModel({
    userId: data.userId,
    title: data.title,
    message: data.message,
    type: data.type || "system",
    read: false,
  })

  await newNotification.save()

  revalidatePath("/notifications")
}

export async function markAsRead(formData: FormData) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  await connectToDatabase()

  const notificationId = formData.get("notificationId") as string

  await NotificationModel.updateOne({ _id: notificationId, userId }, { $set: { read: true } })

  revalidatePath("/notifications")
}

export async function markAllAsRead() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  await connectToDatabase()

  await NotificationModel.updateMany({ userId, read: false }, { $set: { read: true } })

  revalidatePath("/notifications")
}

