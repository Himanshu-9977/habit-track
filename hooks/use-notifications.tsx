"use client"

import { useContext } from "react"
import { NotificationsContext } from "@/components/notifications-provider"

export function useNotifications() {
  try {
    const context = useContext(NotificationsContext)

    if (!context) {
      return { notifications: [], unreadCount: 0, setNotifications: () => {} }
    }

    return context
  } catch (error) {
    // Fallback if context is not available
    console.error("NotificationsContext not available", error)
    return { notifications: [], unreadCount: 0, setNotifications: () => {} }
  }
}

