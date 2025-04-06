import { Card, CardContent } from "@/components/ui/card"
import type { Notification } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { markAsRead } from "@/lib/notifications"
import { Bell } from "lucide-react"

export function NotificationList({ notifications }: { notifications: Notification[] }) {
  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground flex flex-col items-center justify-center py-8">
            <Bell className="h-8 w-8 mb-2 text-muted-foreground/50" />
            <p>No notifications yet.</p>
          </CardContent>
        </Card>
      ) : (
        notifications.map((notification) => (
          <form key={notification._id} action={markAsRead}>
            <input type="hidden" name="notificationId" value={notification._id} />
            <Card className={notification.read ? "bg-muted/40" : "bg-background border-primary/20"}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </div>
                </div>
                {!notification.read && (
                  <div className="mt-4 flex justify-end">
                    <button type="submit" className="text-xs text-primary hover:underline">
                      Mark as read
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </form>
        ))
      )}
    </div>
  )
}

