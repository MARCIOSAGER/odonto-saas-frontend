"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import {
  Loader2,
  Calendar,
  FileText,
  ClipboardList,
  TrendingUp,
  CircleDot,
  CheckCircle,
  XCircle,
  Clock,
  Send,
} from "lucide-react"

interface TimelineEvent {
  id: string
  type: "appointment" | "prescription" | "anamnesis" | "treatment_plan" | "odontogram"
  date: string
  title: string
  description: string
  meta?: Record<string, unknown>
}

const typeConfig: Record<
  string,
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  appointment: {
    icon: Calendar,
    color: "text-blue-600",
    bg: "bg-blue-100",
    label: "Consulta",
  },
  prescription: {
    icon: FileText,
    color: "text-purple-600",
    bg: "bg-purple-100",
    label: "Documento",
  },
  anamnesis: {
    icon: ClipboardList,
    color: "text-orange-600",
    bg: "bg-orange-100",
    label: "Anamnese",
  },
  treatment_plan: {
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-100",
    label: "Plano",
  },
  odontogram: {
    icon: CircleDot,
    color: "text-cyan-600",
    bg: "bg-cyan-100",
    label: "Odontograma",
  },
}

const statusIcons: Record<string, React.ElementType> = {
  completed: CheckCircle,
  cancelled: XCircle,
  confirmed: Clock,
  scheduled: Clock,
}

const typeFilters = [
  { value: "", label: "Todos" },
  { value: "appointment", label: "Consultas" },
  { value: "prescription", label: "Documentos" },
  { value: "anamnesis", label: "Anamnese" },
  { value: "treatment_plan", label: "Planos" },
  { value: "odontogram", label: "Odontograma" },
]

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function formatCurrency(value: unknown): string {
  const num = Number(value)
  if (!num) return ""
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num)
}

export function PatientTimeline({ patientId }: { patientId: string }) {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState("")

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await api.get(`/patients/${patientId}/timeline`)
        const data = res.data?.data || res.data
        setEvents(data.events || [])
      } catch {
        setError("Erro ao carregar histórico")
      } finally {
        setLoading(false)
      }
    }
    if (patientId) load()
  }, [patientId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16 text-muted-foreground">{error}</div>
    )
  }

  const filtered = filter
    ? events.filter((e) => e.type === filter)
    : events

  // Group events by month/year
  const grouped: Record<string, TimelineEvent[]> = {}
  for (const event of filtered) {
    const d = new Date(event.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(event)
  }

  const monthKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  function formatMonth(key: string): string {
    const [year, month] = key.split("-")
    const d = new Date(Number(year), Number(month) - 1)
    return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {typeFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              filter === f.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span>{filtered.length} evento{filtered.length !== 1 ? "s" : ""}</span>
        {!filter && (
          <>
            <span>|</span>
            <span>
              {events.filter((e) => e.type === "appointment").length} consultas
            </span>
            <span>
              {events.filter((e) => e.type === "prescription").length} documentos
            </span>
            <span>
              {events.filter((e) => e.type === "treatment_plan").length} planos
            </span>
          </>
        )}
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nenhum evento encontrado
        </div>
      ) : (
        <div className="space-y-6">
          {monthKeys.map((monthKey) => (
            <div key={monthKey}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 capitalize">
                {formatMonth(monthKey)}
              </h3>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

                <div className="space-y-3">
                  {grouped[monthKey].map((event) => {
                    const config = typeConfig[event.type] || typeConfig.appointment
                    const Icon = config.icon
                    const StatusIcon = event.meta?.status
                      ? statusIcons[event.meta.status as string]
                      : null

                    return (
                      <div key={event.id} className="relative flex gap-3 pl-1">
                        {/* Icon dot */}
                        <div
                          className={`relative z-10 flex items-center justify-center w-7 h-7 rounded-full ${config.bg} shrink-0`}
                        >
                          <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 border rounded-lg p-3 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-sm">
                                  {event.title}
                                </span>
                                <span
                                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${config.bg} ${config.color}`}
                                >
                                  {config.label}
                                </span>
                                {StatusIcon && (
                                  <StatusIcon
                                    className={`h-3.5 w-3.5 ${
                                      event.meta?.status === "completed"
                                        ? "text-green-500"
                                        : event.meta?.status === "cancelled"
                                          ? "text-red-500"
                                          : "text-yellow-500"
                                    }`}
                                  />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {event.description}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                              {formatDate(event.date)}
                            </span>
                          </div>

                          {/* Extra meta */}
                          {event.meta && (
                          <div className="flex flex-wrap gap-2 mt-1.5">
                            {event.meta.price ? (
                              <span className="text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                                {formatCurrency(event.meta.price)}
                              </span>
                            ) : null}
                            {event.meta.total_cost ? (
                              <span className="text-xs text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                                {formatCurrency(event.meta.total_cost)}
                              </span>
                            ) : null}
                            {event.meta.pdf_url ? (
                              <span className="text-xs text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                PDF
                              </span>
                            ) : null}
                            {event.meta.sent_at ? (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Send className="h-3 w-3" />
                                Enviado
                              </span>
                            ) : null}
                            {typeof event.meta.notes === "string" && event.meta.notes ? (
                              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {String(event.meta.notes)}
                              </span>
                            ) : null}
                          </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
