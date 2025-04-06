"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, BellOff } from "lucide-react"
import { subscribeToPushNotifications } from "@/lib/push-notifications"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"

// Helper function to convert base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  if (!base64String) {
    console.error('VAPID key is empty');
    return new Uint8Array();
  }

  try {
    // Remove whitespace and make sure the key is properly formatted
    const cleanKey = base64String.trim();

    // Add padding if needed
    const padding = '='.repeat((4 - cleanKey.length % 4) % 4);

    // Replace web-safe characters with base64 standard characters
    const base64 = (cleanKey + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // Convert to binary
    const rawData = window.atob(base64);

    // Convert to Uint8Array
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  } catch (error) {
    console.error('Error converting VAPID key:', error);
    return new Uint8Array();
  }
}

export function PushNotificationToggle() {
  const [supported, setSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const { userId } = useAuth()

  useEffect(() => {
    // Check if push notifications are supported
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setSupported(false);
      setLoading(false);
      return;
    }

    setSupported(true);

    const registerServiceWorker = async () => {
      try {
        // Register service worker
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/"
        });

        // Check if already subscribed
        const sub = await registration.pushManager.getSubscription();
        setSubscription(sub);
      } catch (err) {
        console.error("Service Worker registration failed:", err);
      } finally {
        setLoading(false);
      }
    };

    registerServiceWorker();
  }, [])

  const subscribe = async () => {
    if (!userId) return

    try {
      setLoading(true)

      // Check if VAPID key is available
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        toast.error("Server configuration error");
        setLoading(false);
        return;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Request permission
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        toast.error("Permission for notifications was denied");
        setLoading(false);
        return;
      }

      // Convert VAPID key
      const applicationServerKey = urlBase64ToUint8Array(vapidKey);

      // Check if the key was properly converted
      if (applicationServerKey.length === 0) {
        throw new Error("Failed to process VAPID key");
      }

      // Try to unsubscribe first if there's an existing subscription
      try {
        const existingSub = await registration.pushManager.getSubscription();
        if (existingSub) {
          await existingSub.unsubscribe();
        }
      } catch (e) {
        // Ignore errors when unsubscribing
      }

      // Subscribe to push notifications with a timeout
      const subscribePromise = registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      // Add a timeout to catch stalled subscriptions
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Subscription timed out after 10 seconds")), 10000);
      });

      const sub = await Promise.race([subscribePromise, timeoutPromise]) as PushSubscription;

      // Serialize the subscription object before sending to server
      const serializedSubscription = JSON.parse(JSON.stringify(sub));

      // Save subscription to server
      await subscribeToPushNotifications(userId, serializedSubscription);

      setSubscription(sub);
      toast.success("Push notifications enabled");
    } catch (error: any) {
      console.error("Failed to subscribe to push notifications:", error);
      toast.error(error?.message || "Failed to enable push notifications");
    } finally {
      setLoading(false);
    }
  }

  const unsubscribe = async () => {
    if (!subscription) return

    try {
      setLoading(true)
      await subscription.unsubscribe()
      setSubscription(null)
      toast.success("Push notifications disabled")
    } catch (error) {
      console.error("Failed to unsubscribe from push notifications:", error)
      toast.error("Failed to disable push notifications")
    } finally {
      setLoading(false)
    }
  }

  if (!supported) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      {subscription ? (
        <Button variant="outline" size="sm" onClick={unsubscribe} disabled={loading}>
          <BellOff className="h-4 w-4 mr-2" />
          Disable Notifications
        </Button>
      ) : (
        <Button variant="outline" size="sm" onClick={subscribe} disabled={loading}>
          <Bell className="h-4 w-4 mr-2" />
          Enable Notifications
        </Button>
      )}
    </div>
  )
}

