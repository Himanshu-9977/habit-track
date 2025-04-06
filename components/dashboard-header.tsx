import { auth } from "@clerk/nextjs/server"

export async function DashboardHeader() {
  const { userId } = await auth()

  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">Track your habits and build consistency.</p>
    </div>
  )
}

