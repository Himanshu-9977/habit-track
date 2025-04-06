import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getStats } from "@/lib/habits"
import { AnalyticsClient } from "@/components/analytics-client"

export default async function AnalyticsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const stats = await getStats(userId)

  return <AnalyticsClient initialStats={stats} />
}


