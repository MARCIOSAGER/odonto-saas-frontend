"use client"
import { useState } from "react"
import dynamic from "next/dynamic"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Loader2, DollarSign, Users, Calendar, TrendingUp, BarChart3 } from "lucide-react"
import { useTranslations } from "next-intl"

const RevenueCharts = dynamic(() => import("@/components/reports/revenue-charts"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
})
const AppointmentsCharts = dynamic(() => import("@/components/reports/appointments-charts"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
})
const PatientsCharts = dynamic(() => import("@/components/reports/patients-charts"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
})
const CashflowCharts = dynamic(() => import("@/components/reports/cashflow-charts"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
})

function ChartSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-muted rounded-xl" />
        ))}
      </div>
      <div className="h-72 bg-muted rounded-xl" />
    </div>
  )
}

type TabKey = "receita" | "atendimentos" | "pacientes" | "fluxo"

export default function ReportsPage() {
  const t = useTranslations("reports")
  const [activeTab, setActiveTab] = useState<TabKey>("receita")
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    d.setMonth(d.getMonth() - 2)
    return d.toISOString().split("T")[0]
  })
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0])

  const params = `start=${startDate}&end=${endDate}`

  const { data: revenue, isLoading: loadingRevenue } = useQuery({
    queryKey: ["reports", "revenue", startDate, endDate],
    queryFn: async () => {
      const res = await api.get(`/reports/revenue?${params}`)
      return res.data?.data || res.data
    },
    enabled: activeTab === "receita",
    staleTime: 5 * 60 * 1000,
  })

  const { data: appointments, isLoading: loadingAppointments } = useQuery({
    queryKey: ["reports", "appointments", startDate, endDate],
    queryFn: async () => {
      const res = await api.get(`/reports/appointments?${params}`)
      return res.data?.data || res.data
    },
    enabled: activeTab === "atendimentos",
    staleTime: 5 * 60 * 1000,
  })

  const { data: patients, isLoading: loadingPatients } = useQuery({
    queryKey: ["reports", "patients", startDate, endDate],
    queryFn: async () => {
      const res = await api.get(`/reports/patients?${params}`)
      return res.data?.data || res.data
    },
    enabled: activeTab === "pacientes",
    staleTime: 5 * 60 * 1000,
  })

  const { data: cashflow, isLoading: loadingCashflow } = useQuery({
    queryKey: ["reports", "cashflow"],
    queryFn: async () => {
      const res = await api.get("/reports/cashflow")
      return res.data?.data || res.data
    },
    enabled: activeTab === "fluxo",
    staleTime: 5 * 60 * 1000,
  })

  const isLoading =
    (activeTab === "receita" && loadingRevenue) ||
    (activeTab === "atendimentos" && loadingAppointments) ||
    (activeTab === "pacientes" && loadingPatients) ||
    (activeTab === "fluxo" && loadingCashflow)

  async function handleExport(type: string) {
    try {
      const res = await api.get(`/reports/export?type=${type}&start=${startDate}&end=${endDate}`, { responseType: "blob" })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement("a")
      a.href = url
      a.download = `${t("report")}-${type}.csv`
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
      a.download = `${t("report")}-${type}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      // ignore
    }
  }

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)

  const tabs: { key: TabKey; label: string; icon: typeof DollarSign }[] = [
    { key: "receita", label: t("revenue"), icon: DollarSign },
    { key: "atendimentos", label: t("appointments"), icon: Calendar },
    { key: "pacientes", label: t("patients"), icon: Users },
    { key: "fluxo", label: t("cashflow"), icon: TrendingUp },
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="h-6 w-6" /> {t("title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <span className="text-muted-foreground">{t("to")}</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>

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

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {activeTab === "receita" && revenue && (
            <RevenueCharts
              data={revenue}
              formatCurrency={formatCurrency}
              onExportCsv={() => handleExport("revenue")}
              onExportPdf={() => handleExportPdf("revenue")}
            />
          )}

          {activeTab === "atendimentos" && appointments && (
            <AppointmentsCharts
              data={appointments}
              onExportCsv={() => handleExport("appointments")}
              onExportPdf={() => handleExportPdf("appointments")}
            />
          )}

          {activeTab === "pacientes" && patients && (
            <PatientsCharts
              data={patients}
              onExportCsv={() => handleExport("patients")}
              onExportPdf={() => handleExportPdf("patients")}
            />
          )}

          {activeTab === "fluxo" && cashflow && (
            <CashflowCharts
              data={cashflow}
              formatCurrency={formatCurrency}
            />
          )}
        </>
      )}
    </div>
  )
}
