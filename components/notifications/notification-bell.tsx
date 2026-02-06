"use client"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Bell, Check } from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import { ptBR, enUS } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useTranslations, useLocale } from "next-intl"

interface Notification {
  id: string
  type: string
  title: string
  body: string
  read: boolean
  created_at: string
  data?: Record<string, unknown> | null
}

export function NotificationBell() {
  const t = useTranslations("notificationBell")
  const locale = useLocale()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Unread count via React Query (invalidated by socket hook)
  const { data: unreadData } = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: async () => {
      const res = await api.get("/notifications/unread-count")
      const data = res.data?.data || res.data
      return { count: data?.count || 0 }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - relies on socket invalidation for real-time updates
  })
  const unreadCount = unreadData?.count || 0

  // Notifications list (only fetched when panel is open)
  const { data: notificationsData, isLoading: loading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/notifications?limit=10")
      const data = res.data?.data || res.data
      const list = Array.isArray(data) ? data : data?.data || []
      return list as Notification[]
    },
    enabled: open,
  })
  const notifications = notificationsData || []

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  async function markAsRead(id: string) {
    try {
      await api.patch(`/notifications/${id}/read`)
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] })
    } catch {}
  }

  async function markAllAsRead() {
    try {
      await api.post("/notifications/read-all")
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.setQueryData(["notifications-unread-count"], { count: 0 })
    } catch {}
  }

  const dateLocale = locale === "pt-BR" ? ptBR : enUS

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-accent transition-colors"
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border bg-popover shadow-lg z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold text-sm">{t("title")}</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                {t("markAllAsRead")}
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                {t("loading")}
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                {t("noNotifications")}
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.read && markAsRead(n.id)}
                  className={cn(
                    "px-4 py-3 border-b last:border-b-0 cursor-pointer hover:bg-accent/50 transition-colors",
                    !n.read && "bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && (
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {n.body}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(n.created_at), {
                          addSuffix: true,
                          locale: dateLocale,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="block text-center text-xs text-primary hover:underline py-2.5 border-t"
          >
            {t("viewAll")}
          </Link>
        </div>
      )}
    </div>
  )
}
