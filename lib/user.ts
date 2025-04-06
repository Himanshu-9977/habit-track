"use server"

import { connectToDatabase } from "@/lib/db"
import { UserModel } from "@/lib/models"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function getUserByClerkId(clerkId: string) {
  await connectToDatabase()

  const user = await UserModel.findOne({ clerkId }).lean()
  return user
}

export async function getCurrentUser() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  await connectToDatabase()

  let user = await UserModel.findOne({ clerkId: userId }).lean()

  if (!user) {
    // Create user if it doesn't exist
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return null
    }

    const newUser = new UserModel({
      clerkId: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
    })

    await newUser.save()
    user = newUser.toObject()
  }

  return user
}

