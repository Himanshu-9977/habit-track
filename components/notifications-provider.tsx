"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"
import type { Notification } from "@/lib/types"
import { useAuth } from "@clerk/nextjs"

type NotificationsContextType = {
  notifications: Notification[]
  unreadCount: number
  setNotifications: (notifications: Notification[]) => void
}

export const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  setNotifications: () => {},
})

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { isSignedIn, userId } = useAuth()

  useEffect(() => {
    if (!isSignedIn || !userId) return

    // Fetch notifications on initial load
    fetchNotifications()

    // Set up polling for new notifications
    const interval = setInterval(fetchNotifications, 60000) // Every minute

    // Request permission for browser notifications
    if ("Notification" in window) {
      Notification.requestPermission()
    }

    return () => clearInterval(interval)
  }, [isSignedIn, userId])

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, setNotifications }}>
      {children}
    </NotificationsContext.Provider>
  )
}

