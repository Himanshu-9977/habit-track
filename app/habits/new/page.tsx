import { HabitForm } from "@/components/habit-form"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function NewHabitPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Habit</h1>
      <HabitForm />
    </div>
  )
}

