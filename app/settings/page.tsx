import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PushNotificationToggle } from "@/components/push-notification-toggle"
import { getCurrentUser } from "@/lib/user"

export default async function SettingsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await getCurrentUser()

  // Get user data from Clerk as a fallback
  const clerkUser = await currentUser()

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <div className="text-sm font-medium text-muted-foreground">Name:</div>
                <div>
                  {user?.firstName || clerkUser?.firstName || ""} {user?.lastName || clerkUser?.lastName || ""}
                </div>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <div className="text-sm font-medium text-muted-foreground">Email:</div>
                <div>{user?.email || clerkUser?.emailAddresses[0]?.emailAddress || ""}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-muted-foreground">Receive notifications in your browser</div>
              </div>
              <PushNotificationToggle />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

