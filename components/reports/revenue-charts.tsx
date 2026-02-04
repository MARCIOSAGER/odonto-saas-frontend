"use client"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import { useTranslations } from "next-intl"

interface RevenueData {
  total_revenue: number
  total_appointments: number
  average_ticket: number
  by_dentist: { name: string; revenue: number; count: number }[]
  by_service: { name: string; revenue: number; count: number }[]
  by_month: { month: string; revenue: number }[]
}

const COLORS = { primary: "#10b981", secondary: "#3b82f6" }

function formatCurrencyShort(v: number) {
  if (v >= 1000) return `R$${(v / 1000).toFixed(1)}k`
  return `R$${v.toFixed(0)}`
}

function CurrencyTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-popover border rounded-lg shadow-lg px-3 py-2 text-sm">
      <p className="font-medium">{label}</p>
      <p className="text-green-600 font-bold">
        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(payload[0].value)}
      </p>
    </div>
  )
}

export default function RevenueCharts({
  data,
  formatCurrency,
  onExportCsv,
  onExportPdf,
}: {
  data: RevenueData
  formatCurrency: (v: number) => string
  onExportCsv: () => void
  onExportPdf: () => void
}) {
  const t = useTranslations("reports")

  const monthNames = [
    t("monthJan"), t("monthFeb"), t("monthMar"), t("monthApr"),
    t("monthMay"), t("monthJun"), t("monthJul"), t("monthAug"),
    t("monthSep"), t("monthOct"), t("monthNov"), t("monthDec"),
  ]

  function formatMonthLabel(month: string) {
    const [y, m] = month.split("-")
    return `${monthNames[parseInt(m, 10) - 1]}/${y.slice(2)}`
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-5">
          <p className="text-xs text-muted-foreground">{t("totalRevenue")}</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(data.total_revenue)}</p>
        </div>
        <div className="bg-card border rounded-xl p-5">
          <p className="text-xs text-muted-foreground">{t("totalAppointments")}</p>
          <p className="text-2xl font-bold mt-1">{data.total_appointments}</p>
        </div>
        <div className="bg-card border rounded-xl p-5">
          <p className="text-xs text-muted-foreground">{t("averageTicket")}</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(data.average_ticket)}</p>
        </div>
      </div>

      {data.by_month.length > 0 && (
        <div className="bg-card border rounded-xl p-5 space-y-3">
          <p className="text-sm font-medium">{t("revenueByMonth")}</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.by_month.map(m => ({ ...m, label: formatMonthLabel(m.month) }))}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatCurrencyShort} tick={{ fontSize: 11 }} width={65} />
                <Tooltip content={<CurrencyTooltip />} />
                <Bar dataKey="revenue" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {data.by_dentist.length > 0 && (
        <div className="bg-card border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{t("revenueByDentist")}</p>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={onExportCsv} className="gap-1 text-xs">
                <Download className="h-3 w-3" /> CSV
              </Button>
              <Button variant="ghost" size="sm" onClick={onExportPdf} className="gap-1 text-xs">
                <FileText className="h-3 w-3" /> PDF
              </Button>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.by_dentist} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" tickFormatter={formatCurrencyShort} tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={120} />
                <Tooltip content={<CurrencyTooltip />} />
                <Bar dataKey="revenue" fill={COLORS.secondary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {data.by_service.length > 0 && (
        <div className="bg-card border rounded-xl p-5 space-y-3">
          <p className="text-sm font-medium">{t("revenueByService")}</p>
          <div className="divide-y">
            {data.by_service.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{t("completedCount", { count: s.count })}</p>
                </div>
                <span className="text-sm font-bold">{formatCurrency(s.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
