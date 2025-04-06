"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

import type { Stats } from "@/lib/types"

export function AnalyticsClient({ initialStats }: { initialStats: Stats }) {
  const stats = initialStats

  // Define custom colors for the chart
  const chartConfig: ChartConfig = {
    completed: {
      label: "Completed",
      color: "hsl(143, 85%, 40%)", // Bright green
    },
    missed: {
      label: "Missed",
      color: "hsl(0, 84%, 60%)", // Bright red
    },
    placeholder: {
      label: "No Data",
      color: "hsl(220, 14%, 90%)", // Very light gray
    },
  }

  // Transform data for the chart
  const chartData = stats.streakData.map((item) => {
    const hasData = item.completedCount > 0 || item.missedCount > 0;
    return {
      day: item.day,
      completed: item.completedCount,
      missed: item.missedCount,
      placeholder: hasData ? 0 : 1, // Show placeholder when no data
      status: item.completed ? "completed" : (item.missedCount > 0 ? "missed" : "placeholder"),
    };
  })

  return (
    <div className="container py-6 space-y-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Track your progress and see your habits over time.</p>
      </div>

      <div className="grid gap-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Weekly Completion</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={30}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Bar
                    dataKey="placeholder"
                    stackId="a"
                    fill="var(--color-placeholder)"
                    radius={[4, 4, 4, 4]}
                    fillOpacity={0.5}
                  />
                  <Bar
                    dataKey="completed"
                    stackId="a"
                    fill="var(--color-completed)"
                    radius={[4, 4, 0, 0]}
                    fillOpacity={1}
                  />
                  <Bar
                    dataKey="missed"
                    stackId="a"
                    fill="var(--color-missed)"
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.9}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Completion Rate</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="text-4xl sm:text-6xl font-bold">{stats.completionRate}%</div>
              <p className="text-sm text-muted-foreground mt-2">Last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Streak</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="text-4xl sm:text-6xl font-bold">{stats.currentStreak}</div>
              <p className="text-sm text-muted-foreground mt-2">days in a row</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
