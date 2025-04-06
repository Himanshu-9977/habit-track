"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="container flex flex-col items-center justify-center min-h-screen text-center">
          <h1 className="text-4xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground mt-2 mb-6">An error occurred while processing your request.</p>
          <Button onClick={reset}>Try again</Button>
        </div>
      </body>
    </html>
  )
}

