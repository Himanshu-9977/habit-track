import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/sonner"
import { ClerkProvider } from "@clerk/nextjs"
import { NotificationsProvider } from "@/components/notifications-provider"
import { Container } from "@/components/ui/container"
import type { Metadata } from "next"
import { dark } from '@clerk/themes'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track your habits and build consistency",
  // manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
    appearance={{
      baseTheme: dark,
    }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <NotificationsProvider>
              <div className="relative flex min-h-screen flex-col">
                <Container>
                  <Navbar />
                  <main className="flex-1">
                    {children}
                  </main>
                </Container>
              </div>
              <Toaster />
            </NotificationsProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}



import './globals.css'