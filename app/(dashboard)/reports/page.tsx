"use client"
import { useEffect, useState, useCallback } from "react"
import { api } from "@/lib/api"
import { Loader2, DollarSign, Users, Calendar, TrendingUp, Download, BarChart3, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RevenueData {
  total_revenue: number
  total_appointments: number
  average_ticket: number
  by_dentist: { name: string; revenue: number; count: number }[]
  by_service: { name: string; revenue: number; count: number }[]
  by_month: { month: string; revenue: number }[]
}

interface AppointmentsData {
  total: number
  completed: number
  cancelled: number
  no_show: number
  attendance_rate: number
  cancellation_rate: number
  no_show_rate: number
}

interface PatientsData {
  total_active: number
  total_inactive: number
  new_in_period: number
  by_month: { month: string; new_patients: number }[]
}

interface CashflowData {
  projection_30d: { appointments: number; revenue: number }
  projection_60d: { appointments: number; revenue: number }
  projection_90d: { appointments: number; revenue: number }
}

type TabKey = "receita" | "atendimentos" | "pacientes" | "fluxo"

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("receita")
  const [loading, setLoading] = useState(true)
  const [revenue, setRevenue] = useState<RevenueData | null>(null)
  const [appointments, setAppointments] = useState<AppointmentsData | null>(null)
  const [patients, setPatients] = useState<PatientsData | null>(null)
  const [cashflow, setCashflow] = useState<CashflowData | null>(null)
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    d.setMonth(d.getMonth() - 2)
    return d.toISOString().split("T")[0]
  })
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0])

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const params = `start=${startDate}&end=${endDate}`
      const [revRes, aptRes, patRes, cfRes] = await Promise.all([
        api.get(`/reports/revenue?${params}`),
        api.get(`/reports/appointments?${params}`),
        api.get(`/reports/patients?${params}`),
        api.get("/reports/cashflow"),
      ])
      setRevenue(revRes.data?.data || revRes.data)
      setAppointments(aptRes.data?.data || aptRes.data)
      setPatients(patRes.data?.data || patRes.data)
      setCashflow(cfRes.data?.data || cfRes.data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleExport(type: string) {
    try {
      const res = await api.get(`/reports/export?type=${type}&start=${startDate}&end=${endDate}`, { responseType: "blob" })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement("a")
      a.href = url
      a.download = `relatorio-${type}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      // ignore
    }
  }

  async function handleExportPdf(type: string) {
    try {
      const res = await api.get(`/reports/export-pdf?type=${type}&start=${startDate}&end=${endDate}`, { responseType: "blob" })
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }))
      const a = document.createElement("a")
      a.href = url
      a.download = `relatorio-${type}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      // ignore
    }
  }

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)

  const tabs: { key: TabKey; label: string; icon: typeof DollarSign }[] = [
    { key: "receita", label: "Receita", icon: DollarSign },
    { key: "atendimentos", label: "Atendimentos", icon: Calendar },
    { key: "pacientes", label: "Pacientes", icon: Users },
    { key: "fluxo", label: "Fluxo de Caixa", icon: TrendingUp },
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="h-6 w-6" /> Relat&oacute;rios</h1>
          <p className="text-sm text-muted-foreground mt-1">Vis&atilde;o financeira e operacional da cl&iacute;nica</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <span className="text-muted-foreground">a</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-card rounded-lg p-1 border">
        {tabs.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              }`}
            >
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Revenue tab */}
          {activeTab === "receita" && revenue && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border rounded-xl p-5">
                  <p className="text-xs text-muted-foreground">Receita Total</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(revenue.total_revenue)}</p>
                </div>
                <div className="bg-card border rounded-xl p-5">
                  <p className="text-xs text-muted-foreground">Atendimentos</p>
                  <p className="text-2xl font-bold mt-1">{revenue.total_appointments}</p>
                </div>
                <div className="bg-card border rounded-xl p-5">
                  <p className="text-xs text-muted-foreground">Ticket M&eacute;dio</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(revenue.average_ticket)}</p>
                </div>
              </div>

              {/* Revenue by month */}
              {revenue.by_month.length > 0 && (
                <div className="bg-card border rounded-xl p-5 space-y-3">
                  <p className="text-sm font-medium">Receita por m&ecirc;s</p>
                  <div className="space-y-2">
                    {revenue.by_month.map((m) => {
                      const maxRev = Math.max(...revenue.by_month.map((x) => x.revenue))
                      const pct = maxRev > 0 ? (m.revenue / maxRev) * 100 : 0
                      return (
                        <div key={m.month} className="flex items-center gap-3">
                          <span className="text-xs font-medium w-16">{m.month}</span>
                          <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full flex items-center justify-end pr-2" style={{ width: `${Math.max(pct, 5)}%` }}>
                              <span className="text-[10px] text-primary-foreground font-medium">{formatCurrency(m.revenue)}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* By dentist */}
              {revenue.by_dentist.length > 0 && (
                <div className="bg-card border rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Receita por dentista</p>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleExport("revenue")} className="gap-1 text-xs">
                        <Download className="h-3 w-3" /> CSV
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleExportPdf("revenue")} className="gap-1 text-xs">
                        <FileText className="h-3 w-3" /> PDF
                      </Button>
                    </div>
                  </div>
                  <div className="divide-y">
                    {revenue.by_dentist.map((d, i) => (
                      <div key={i} className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium">{d.name}</p>
                          <p className="text-xs text-muted-foreground">{d.count} atendimentos</p>
                        </div>
                        <span className="text-sm font-bold text-green-600">{formatCurrency(d.revenue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* By service */}
              {revenue.by_service.length > 0 && (
                <div className="bg-card border rounded-xl p-5 space-y-3">
                  <p className="text-sm font-medium">Receita por servi&ccedil;o</p>
                  <div className="divide-y">
                    {revenue.by_service.map((s, i) => (
                      <div key={i} className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.count} realizados</p>
                        </div>
                        <span className="text-sm font-bold">{formatCurrency(s.revenue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Appointments tab */}
          {activeTab === "atendimentos" && appointments && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-card border rounded-xl p-5">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold mt-1">{appointments.total}</p>
                </div>
                <div className="bg-card border rounded-xl p-5">
                  <p className="text-xs text-muted-foreground">Taxa Comparecimento</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{appointments.attendance_rate}%</p>
                </div>
                <div className="bg-card border rounded-xl p-5">
                  <p className="text-xs text-muted-foreground">Taxa Cancelamento</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{appointments.cancellation_rate}%</p>
                </div>
              </div>

              <div className="bg-card border rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Resumo por status</p>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleExport("appointments")} className="gap-1 text-xs">
                      <Download className="h-3 w-3" /> CSV
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleExportPdf("appointments")} className="gap-1 text-xs">
                      <FileText className="h-3 w-3" /> PDF
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { label: "Realizados", value: appointments.completed, color: "bg-green-100 text-green-800" },
                    { label: "Cancelados", value: appointments.cancelled, color: "bg-red-100 text-red-800" },
                    { label: "Faltas", value: appointments.no_show, color: "bg-amber-100 text-amber-800" },
                    { label: "Agendados", value: appointments.total - appointments.completed - appointments.cancelled - appointments.no_show, color: "bg-blue-100 text-blue-800" },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-lg p-3 text-center ${item.color}`}>
                      <p className="text-2xl font-bold">{item.value}</p>
                      <p className="text-xs font-medium">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Patients tab */}
          {activeTab === "pacientes" && patients && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border rounded-xl p-5">
                  <p className="text-xs text-muted-foreground">Pacientes Ativos</p>
                  <p className="text-2xl font-bold mt-1">{patients.total_active}</p>
                </div>
                <div className="bg-card border rounded-xl p-5">
                  <p className="text-xs text-muted-foreground">Novos no Per&iacute;odo</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{patients.new_in_period}</p>
                </div>
                <div className="bg-card border rounded-xl p-5">
                  <p className="text-xs text-muted-foreground">Inativos</p>
                  <p className="text-2xl font-bold text-muted-foreground mt-1">{patients.total_inactive}</p>
                </div>
              </div>

              {patients.by_month.length > 0 && (
                <div className="bg-card border rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Novos pacientes por m&ecirc;s</p>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleExport("patients")} className="gap-1 text-xs">
                        <Download className="h-3 w-3" /> CSV
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleExportPdf("patients")} className="gap-1 text-xs">
                        <FileText className="h-3 w-3" /> PDF
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {patients.by_month.map((m) => {
                      const maxCount = Math.max(...patients.by_month.map((x) => x.new_patients))
                      const pct = maxCount > 0 ? (m.new_patients / maxCount) * 100 : 0
                      return (
                        <div key={m.month} className="flex items-center gap-3">
                          <span className="text-xs font-medium w-16">{m.month}</span>
                          <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full flex items-center justify-end pr-2" style={{ width: `${Math.max(pct, 8)}%` }}>
                              <span className="text-[10px] text-primary-foreground font-medium">{m.new_patients}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cashflow tab */}
          {activeTab === "fluxo" && cashflow && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border rounded-xl p-5">
                  <p className="text-xs text-muted-foreground">Pr&oacute;ximos 30 dias</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(cashflow.projection_30d.revenue)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{cashflow.projection_30d.appointments} consultas agendadas</p>
                </div>
                <div className="bg-card border rounded-xl p-5">
                  <p className="text-xs text-muted-foreground">30-60 dias</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(cashflow.projection_60d.revenue)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{cashflow.projection_60d.appointments} consultas agendadas</p>
                </div>
                <div className="bg-card border rounded-xl p-5">
                  <p className="text-xs text-muted-foreground">60-90 dias</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(cashflow.projection_90d.revenue)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{cashflow.projection_90d.appointments} consultas agendadas</p>
                </div>
              </div>

              <div className="bg-card border rounded-xl p-5">
                <p className="text-sm text-muted-foreground">
                  Proje&ccedil;&atilde;o baseada em consultas j&aacute; agendadas. Os valores reais podem variar conforme novos agendamentos e cancelamentos.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
