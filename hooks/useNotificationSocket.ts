"use client"
import { useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"
import { useSession } from "next-auth/react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { env } from "@/lib/env"

function getSocketUrl(): string {
  try {
    const url = new URL(env.apiUrl)
    return url.origin
  } catch {
    return env.apiUrl
  }
}

export function useNotificationSocket() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | null>(null)

  const token = (session as any)?.accessToken as string | undefined

  useEffect(() => {
    if (!token) return

    const socket = io(`${getSocketUrl()}/notifications`, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 3000,
    })

    socket.on("notification.new", (notification: any) => {
      toast(notification.title, {
        description: notification.body,
      })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      })
    })

    socket.on("notification.count", ({ count }: { count: number }) => {
      queryClient.setQueryData(["notifications-unread-count"], { count })
    })

    socketRef.current = socket

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [token, queryClient])
}
