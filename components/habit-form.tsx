"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createHabit, updateHabit } from "@/lib/habits"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { Habit } from "@/lib/types"

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  description: z.string().max(200, "Description is too long").optional(),
  frequency: z.enum(["daily", "weekly"]),
  reminderEnabled: z.boolean().default(false),
  reminderTime: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

// This is a workaround for the TypeScript errors with react-hook-form
type FormValuesFixed = {
  name: string
  frequency: "daily" | "weekly"
  reminderEnabled: boolean
  description?: string
  reminderTime?: string
}

export function HabitForm({
  habit,
}: {
  habit?: Habit
}) {
  const router = useRouter()
  const isEditing = !!habit

  const defaultValues: Partial<FormValues> = {
    name: habit?.name || "",
    description: habit?.description || "",
    frequency: habit?.frequency || "daily",
    reminderEnabled: habit?.reminderEnabled || false,
    reminderTime: habit?.reminderTime || "",
  }

  const form = useForm<FormValuesFixed>({
    resolver: zodResolver(formSchema) as any,
    defaultValues,
  })

  const reminderEnabled = form.watch("reminderEnabled")

  async function onSubmit(values: FormValuesFixed) {
    try {
      // Prepare values for submission
      const formattedValues = {
        ...values,
        // Only include reminderTime if reminderEnabled is true
        reminderTime: values.reminderEnabled ? values.reminderTime : undefined
      }

      if (isEditing) {
        await updateHabit(habit._id.toString(), formattedValues)
        toast.success("Habit updated successfully")
      } else {
        await createHabit(formattedValues)
        toast.success("Habit created successfully")
      }
      router.push("/")
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
            <FormField
              control={form.control as any}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Exercise" {...field} />
                  </FormControl>
                  <FormDescription>The name of your habit.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="30 minutes of exercise daily" {...field} />
                  </FormControl>
                  <FormDescription>A brief description of your habit.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>How often you want to perform this habit.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="reminderEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Reminders</FormLabel>
                    <FormDescription>Receive reminders for this habit.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {reminderEnabled && (
              <FormField
                control={form.control as any}
                name="reminderTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reminder Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>When to send the reminder.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit">{isEditing ? "Update Habit" : "Create Habit"}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

