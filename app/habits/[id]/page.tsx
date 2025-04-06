import { HabitForm } from "@/components/habit-form"
import { getHabitById } from "@/lib/habits"
import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"

type paramsType = Promise<{ id: string }>;
export default async function EditHabitPage({ params }: {params: paramsType}) {
  const { userId } = await auth()
  const {id} = await params
  if (!userId) {
    redirect("/sign-in")
  }

  const habit = await getHabitById(id, userId)

  if (!habit) {
    notFound()
  }

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Habit</h1>
      <HabitForm habit={habit} />
    </div>
  )
}
