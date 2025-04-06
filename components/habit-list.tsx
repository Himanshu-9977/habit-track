import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Habit } from "@/lib/types"
import { CheckCircle, Edit, Trash2 } from "lucide-react"
import { logHabit, deleteHabit } from "@/lib/habits"

export function HabitList({ habits }: { habits: Habit[] }) {
  return (
    <div className="space-y-4">
      {habits.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No habits yet. Create your first habit to get started!
          </CardContent>
        </Card>
      ) : (
        habits.map((habit) => (
          <Card key={habit._id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{habit.name}</CardTitle>
              <CardDescription>{habit.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Current streak: <span className="font-medium">{habit.currentStreak} days</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Best streak: <span className="font-medium">{habit.bestStreak} days</span>
                  </p>
                </div>
                <form action={logHabit} className="w-full sm:w-auto">
                  <input type="hidden" name="habitId" value={habit._id.toString()} />
                  <Button
                    type="submit"
                    variant={habit.completedToday ? "secondary" : "default"}
                    className="gap-1 w-full sm:w-auto"
                    disabled={habit.completedToday}
                  >
                    <CheckCircle className="h-4 w-4" />
                    {habit.completedToday ? "Completed" : "Complete"}
                  </Button>
                </form>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex flex-col sm:flex-row gap-2 sm:justify-between">
              <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                <a href={`/habits/${habit._id.toString()}`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </a>
              </Button>
              <form action={deleteHabit} className="w-full sm:w-auto">
                <input type="hidden" name="habitId" value={habit._id.toString()} />
                <Button variant="destructive" size="sm" type="submit" className="w-full sm:w-auto">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </form>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}

