"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { formatDistanceToNow, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Bell, Check, CheckCheck, Filter, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface Notification {
  id: string
  type: string
  title: string
  body: string
  read: boolean
  created_at: string
  data?: Record<string, unknown> | null
}

interface NotificationsResponse {
  data: Notification[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

const typeLabels: Record<string, string> = {
  appointment: "Agendamento",
  patient: "Paciente",
  reminder: "Lembrete",
  system: "Sistema",
  nps: "NPS",
  billing: "Faturamento",
  whatsapp: "WhatsApp",
}

const typeColors: Record<string, string> = {
  appointment: "bg-blue-500",
  patient: "bg-green-500",
  reminder: "bg-amber-500",
  system: "bg-slate-500",
  nps: "bg-purple-500",
  billing: "bg-emerald-500",
  whatsapp: "bg-green-600",
}

export default function NotificationsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<string>("all")
  const limit = 20

  const { data, isLoading } = useQuery<NotificationsResponse>({
    queryKey: ["notifications", page, limit],
    queryFn: async () => {
      const res = await api.get("/notifications", { params: { page, limit } })
      return res.data?.data || res.data
    },
  })

  const { data: unreadData } = useQuery<{ count: number }>({
    queryKey: ["notifications-unread-count"],
    queryFn: async () => {
      const res = await api.get("/notifications/unread-count")
      return res.data?.data || res.data
    },
  })

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] })
    },
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: () => api.post("/notifications/read-all"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] })
      toast.success("Todas as notificações marcadas como lidas")
    },
  })

  const notifications = data?.data || []
  const meta = data?.meta
  const unreadCount = unreadData?.count || 0

  const filteredNotifications =
    filter === "all"
      ? notifications
      : filter === "unread"
        ? notifications.filter((n) => !n.read)
        : notifications.filter((n) => n.type === filter)

  const uniqueTypes = [...new Set(notifications.map((n) => n.type))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notificações</h1>
          <p className="text-muted-foreground text-sm">
            {unreadCount > 0
              ? `Você tem ${unreadCount} notificação${unreadCount > 1 ? "ões" : ""} não lida${unreadCount > 1 ? "s" : ""}`
              : "Todas as notificações foram lidas"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
            >
              {markAllAsReadMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCheck className="h-4 w-4 mr-2" />
              )}
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="unread">Não lidas</SelectItem>
            {uniqueTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {typeLabels[type] || type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {meta ? `${meta.total} notificações` : "Notificações"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Bell className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm">
                {filter !== "all"
                  ? "Nenhuma notificação encontrada com este filtro"
                  : "Nenhuma notificação"}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-4 px-6 py-4 transition-colors hover:bg-accent/50",
                    !notification.read && "bg-primary/[0.03]"
                  )}
                >
                  {/* Type indicator */}
                  <div className="mt-1 flex flex-col items-center gap-1">
                    <div
                      className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        notification.read
                          ? "bg-muted-foreground/20"
                          : typeColors[notification.type] || "bg-primary"
                      )}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={cn(
                              "text-sm",
                              !notification.read ? "font-semibold" : "font-medium"
                            )}
                          >
                            {notification.title}
                          </p>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-medium shrink-0">
                            {typeLabels[notification.type] || notification.type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {notification.body}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                          {" · "}
                          {format(new Date(notification.created_at), "dd/MM/yyyy HH:mm")}
                        </p>
                      </div>

                      {/* Mark as read */}
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="shrink-0 text-muted-foreground hover:text-primary"
                          onClick={() => markAsReadMutation.mutate(notification.id)}
                          disabled={markAsReadMutation.isPending}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-6 py-3">
              <p className="text-sm text-muted-foreground">
                Página {meta.page} de {meta.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
