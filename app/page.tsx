import { Button } from "@/components/ui/button"
import { HabitList } from "@/components/habit-list"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCards } from "@/components/stats-cards"
import { StreakChart } from "@/components/streak-chart"
import { auth } from "@clerk/nextjs/server"
import { getHabits, getStats } from "@/lib/habits"
import Link from "next/link"
import { ArrowRight, CheckCircle, TrendingUp, Bell } from "lucide-react"

export default async function Home() {
  const { userId } = await auth()

  // If user is authenticated, show dashboard
  if (userId) {
    const habits = await getHabits(userId)
    const stats = await getStats(userId)

    return (
      <div className="container py-6 space-y-8 px-4 sm:px-6 lg:px-8">
        <DashboardHeader />
        <StatsCards stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4 order-2 lg:order-1">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Your Habits</h2>
              <Button asChild>
                <Link href="/habits/new">Create Habit</Link>
              </Button>
            </div>
            <HabitList habits={habits} />
          </div>
          <div className="space-y-4 order-1 lg:order-2">
            <h2 className="text-2xl font-bold tracking-tight">Your Streak</h2>
            <StreakChart data={stats.streakData} />
          </div>
        </div>
      </div>
    )
  }

  // If user is not authenticated, show landing page
  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Hero Section */}
      <section className="flex-1 py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Build Better Habits, Track Your Progress
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Our habit tracking app helps you build consistency and achieve your goals with powerful tracking and
                  analytics.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/sign-up">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                alt="Habit Tracker Dashboard"
                className="aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                src="/placeholder.svg?height=550&width=800"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Key Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to build better habits and track your progress
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
              <div className="rounded-full bg-primary/10 p-3">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Habit Tracking</h3>
              <p className="text-center text-muted-foreground">Create and track daily or weekly habits with ease</p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
              <div className="rounded-full bg-primary/10 p-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Analytics</h3>
              <p className="text-center text-muted-foreground">
                Visualize your progress with detailed analytics and charts
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Reminders</h3>
              <p className="text-center text-muted-foreground">Never miss a habit with customizable reminders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t items-center px-4 md:px-6">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Habit Tracker. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

