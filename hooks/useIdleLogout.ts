"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import { signOut } from "next-auth/react"
import { api } from "@/lib/api"

const IDLE_KEY = "odonto_last_activity"
const IDLE_TIMEOUT_MS = 30 * 60 * 1000       // 30 minutes
const WARNING_BEFORE_MS = 5 * 60 * 1000      // Show warning 5 min before logout
const CHECK_INTERVAL_MS = 60 * 1000          // Check every 60s
const COUNTDOWN_INTERVAL_MS = 1000           // 1s countdown when warning is active
const THROTTLE_MS = 30 * 1000                // Throttle activity writes to 30s

function now() {
  return Date.now()
}

function getLastActivity(): number {
  try {
    const stored = localStorage.getItem(IDLE_KEY)
    return stored ? parseInt(stored, 10) : now()
  } catch {
    return now()
  }
}

function setLastActivity(ts: number) {
  try {
    localStorage.setItem(IDLE_KEY, String(ts))
  } catch {
    // localStorage may be unavailable (private browsing, quota)
  }
}

export function useIdleLogout() {
  const [showWarning, setShowWarning] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(300)
  const lastWriteRef = useRef(0)
  const isLoggingOutRef = useRef(false)

  const performLogout = useCallback(async () => {
    if (isLoggingOutRef.current) return
    isLoggingOutRef.current = true

    // Best-effort backend logout to blacklist token
    try {
      await api.post("/auth/logout")
    } catch {
      // Token may already be expired — still sign out client-side
    }

    signOut({ callbackUrl: "/login?reason=idle" })
  }, [])

  const resetActivity = useCallback(() => {
    const ts = now()
    setLastActivity(ts)
    lastWriteRef.current = ts
    setShowWarning(false)
    setRemainingSeconds(300)
  }, [])

  // Register activity listeners
  useEffect(() => {
    // Initialize
    setLastActivity(now())
    lastWriteRef.current = now()

    const handleActivity = () => {
      const current = now()
      if (current - lastWriteRef.current >= THROTTLE_MS) {
        setLastActivity(current)
        lastWriteRef.current = current
        // Reset warning if user becomes active
        setShowWarning(false)
        setRemainingSeconds(300)
      }
    }

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"]
    events.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }))

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity))
    }
  }, [])

  // Cross-tab sync via storage event
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === IDLE_KEY && e.newValue) {
        const otherTabActivity = parseInt(e.newValue, 10)
        if (!isNaN(otherTabActivity)) {
          // Another tab registered activity — reset our warning
          lastWriteRef.current = otherTabActivity
          setShowWarning(false)
          setRemainingSeconds(300)
        }
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  // Check interval
  useEffect(() => {
    const checkIdle = () => {
      if (isLoggingOutRef.current) return

      const lastActivity = getLastActivity()
      const elapsed = now() - lastActivity

      if (elapsed >= IDLE_TIMEOUT_MS) {
        performLogout()
      } else if (elapsed >= IDLE_TIMEOUT_MS - WARNING_BEFORE_MS) {
        setShowWarning(true)
        const remaining = Math.max(0, Math.ceil((IDLE_TIMEOUT_MS - elapsed) / 1000))
        setRemainingSeconds(remaining)
      }
    }

    // Use faster interval when warning is active
    const intervalMs = showWarning ? COUNTDOWN_INTERVAL_MS : CHECK_INTERVAL_MS
    const interval = setInterval(checkIdle, intervalMs)

    return () => clearInterval(interval)
  }, [showWarning, performLogout])

  return {
    showWarning,
    remainingSeconds,
    dismissWarning: resetActivity,
  }
}
