"use server"

import { connectToDatabase } from "@/lib/db"
import { UserModel } from "@/lib/models"
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:himanshubhatta666@gmail.com', // Your contact email
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY! // Store this securely in .env.local
);


export async function subscribeToPushNotifications(userId: string, subscription: any) {
  await connectToDatabase()

  await UserModel.updateOne({ clerkId: userId }, { $set: { pushSubscription: subscription } })

  return { success: true }
}

export async function sendPushNotification(userId: string, title: string, message: string, url?: string) {
  await connectToDatabase()

  const user = await UserModel.findOne({ clerkId: userId })

  if (!user || !user.pushSubscription) {
    return { success: false, error: "No push subscription found" }
  }

  try {
    const payload = JSON.stringify({
      title,
      message,
      url,
    })

    // Make sure the subscription has the necessary properties
    if (!user.pushSubscription || !user.pushSubscription.endpoint) {
      return { success: false, error: "Invalid push subscription" }
    }

    await webpush.sendNotification(user.pushSubscription, payload)

    return { success: true }
  } catch (error) {
    console.error("Failed to send push notification:", error)
    return { success: false, error }
  }
}

