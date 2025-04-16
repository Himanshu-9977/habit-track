import { NotificationList } from "@/components/notification-list"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getNotifications, markAllAsRead } from "@/lib/notifications"

export default async function NotificationsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const notifications = await getNotifications(userId)

  return (
    <div className="container max-w-2xl py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <form action={markAllAsRead}>
          <button className="text-sm text-muted-foreground underline">Mark all as read</button>
        </form>
      </div>
      <NotificationList notifications={notifications} />
    </div>
  )
}

