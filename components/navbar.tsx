"use client"

import { useState } from "react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { UserButton, useAuth } from "@clerk/nextjs"
import { NotificationBell } from "@/components/notification-bell"
import { usePathname } from "next/navigation"
import { Menu, Settings } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Container } from "@/components/ui/container"

export function Navbar() {
  const { isSignedIn } = useAuth()
  const pathname = usePathname()
  const [sheetOpen, setSheetOpen] = useState(false)

  const closeSheet = () => setSheetOpen(false)

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors hover:text-primary ${
        pathname === href ? "text-primary" : "text-muted-foreground"
      }`}
      onClick={closeSheet}
    >
      {children}
    </Link>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="font-bold mr-6">
            Habit Tracker
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
            {isSignedIn && (
              <>
                <NavLink href="/">Dashboard</NavLink>
                <NavLink href="/analytics">Analytics</NavLink>
              </>
            )}
          </nav>
        </div>

        {/* Desktop Right Side */}
        <div className="flex items-center space-x-2">
          {/* Mobile Notifications */}
          {isSignedIn && (
            <div className="md:hidden">
              <NotificationBell />
            </div>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Habit Tracker</SheetTitle>
                </SheetHeader>
                <div className="py-6 text-center">
                  {isSignedIn ? (
                    <>
                      <nav className="flex flex-col space-y-6 mb-8">
                        <NavLink href="/">Dashboard</NavLink>
                        <NavLink href="/analytics">Analytics</NavLink>
                        <NavLink href="/settings">Settings</NavLink>
                      </nav>
                      <div className="flex items-center justify-center pt-6 border-t gap-10">
                        <div className="flex items-center space-x-4">
                          <ModeToggle />
                        </div>
                        <UserButton />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-6">
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/sign-in" onClick={closeSheet}>Sign In</Link>
                      </Button>
                      <Button asChild className="w-full justify-start">
                        <Link href="/sign-up" onClick={closeSheet}>Sign Up</Link>
                      </Button>
                      <div className="pt-6 border-t">
                        <ModeToggle />
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <NotificationBell />
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/settings" onClick={closeSheet}>
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                  </Link>
                </Button>
                <UserButton />
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/sign-in" onClick={closeSheet}>Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up" onClick={closeSheet}>Sign Up</Link>
                </Button>
              </>
            )}
            <ModeToggle />
          </div>
        </div>
      </Container>
    </header>
  )
}

