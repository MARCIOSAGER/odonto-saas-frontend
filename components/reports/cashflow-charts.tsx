"use client"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import { useTranslations } from "next-intl"

interface CashflowData {
  projection_30d: { appointments: number; revenue: number }
  projection_60d: { appointments: number; revenue: number }
  projection_90d: { appointments: number; revenue: number }
}

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

export default function CashflowCharts({
  data,
  formatCurrency,
}: {
  data: CashflowData
  formatCurrency: (v: number) => string
}) {
  const t = useTranslations("reports")

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-5">
          <p className="text-xs text-muted-foreground">{t("next30Days")}</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(data.projection_30d.revenue)}</p>
          <p className="text-xs text-muted-foreground mt-1">{t("scheduledAppointments", { count: data.projection_30d.appointments })}</p>
        </div>
        <div className="bg-card border rounded-xl p-5">
          <p className="text-xs text-muted-foreground">{t("days30to60")}</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(data.projection_60d.revenue)}</p>
          <p className="text-xs text-muted-foreground mt-1">{t("scheduledAppointments", { count: data.projection_60d.appointments })}</p>
        </div>
        <div className="bg-card border rounded-xl p-5">
          <p className="text-xs text-muted-foreground">{t("days60to90")}</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(data.projection_90d.revenue)}</p>
          <p className="text-xs text-muted-foreground mt-1">{t("scheduledAppointments", { count: data.projection_90d.appointments })}</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-5 space-y-3">
        <p className="text-sm font-medium">{t("revenueProjection")}</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { period: t("period0to30"), revenue: data.projection_30d.revenue, appointments: data.projection_30d.appointments },
              { period: t("period30to60"), revenue: data.projection_60d.revenue, appointments: data.projection_60d.appointments },
              { period: t("period60to90"), revenue: data.projection_90d.revenue, appointments: data.projection_90d.appointments },
            ]}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatCurrencyShort} tick={{ fontSize: 11 }} width={65} />
              <Tooltip content={<CurrencyTooltip />} />
              <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]}>
                <Cell fill="#10b981" />
                <Cell fill="#3b82f6" />
                <Cell fill="#8b5cf6" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-5">
        <p className="text-sm text-muted-foreground">
          {t("projectionNote")}
        </p>
      </div>
    </div>
  )
}
