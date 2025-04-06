import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container max-w-2xl py-8">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-4 w-[120px]" />
      </div>

      <div className="space-y-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <Skeleton className="h-5 w-[200px]" />
                    <Skeleton className="h-4 w-[300px] mt-2" />
                  </div>
                  <Skeleton className="h-4 w-[80px]" />
                </div>
                <div className="mt-4 flex justify-end">
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}

