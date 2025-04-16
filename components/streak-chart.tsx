"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { StreakData } from "@/lib/types"
import { BarChart, Bar, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

export function StreakChart({ data }: { data: StreakData[] }) {
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
  const chartData = data.map((item) => {
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
    <Card className="overflow-hidden">
      <CardContent className="pt-6 p-0 sm:p-6 overflow-x-auto overflow-y-hidden">
        <ChartContainer config={chartConfig} className="h-[180px] sm:h-[200px]">
          <BarChart data={chartData} barSize={25}>
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
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

