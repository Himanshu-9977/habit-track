import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container max-w-2xl py-8">
      <Skeleton className="h-10 w-[150px] mb-6" />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="h-4 w-[200px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[250px]" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-4 w-[250px] mt-1" />
              </div>
              <Skeleton className="h-10 w-[150px]" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

