import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { getNotifications } from "@/lib/notifications"

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const notifications = await getNotifications(userId)
    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Failed to fetch notifications:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

