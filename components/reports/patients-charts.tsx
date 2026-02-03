"use client"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"

interface PatientsData {
  total_active: number
  total_inactive: number
  new_in_period: number
  by_month: { month: string; new_patients: number }[]
}

function formatMonthLabel(month: string) {
  const [y, m] = month.split("-")
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
  return `${months[parseInt(m, 10) - 1]}/${y.slice(2)}`
}

function CountTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-popover border rounded-lg shadow-lg px-3 py-2 text-sm">
      <p className="font-medium">{label}</p>
      <p className="text-primary font-bold">{payload[0].value} pacientes</p>
    </div>
  )
}

export default function PatientsCharts({
  data,
  onExportCsv,
  onExportPdf,
}: {
  data: PatientsData
  onExportCsv: () => void
  onExportPdf: () => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-5">
          <p className="text-xs text-muted-foreground">Pacientes Ativos</p>
          <p className="text-2xl font-bold mt-1">{data.total_active}</p>
        </div>
        <div className="bg-card border rounded-xl p-5">
          <p className="text-xs text-muted-foreground">Novos no Período</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{data.new_in_period}</p>
        </div>
        <div className="bg-card border rounded-xl p-5">
          <p className="text-xs text-muted-foreground">Inativos</p>
          <p className="text-2xl font-bold text-muted-foreground mt-1">{data.total_inactive}</p>
        </div>
      </div>

      {data.by_month.length > 0 && (
        <div className="bg-card border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Novos pacientes por mês</p>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={onExportCsv} className="gap-1 text-xs">
                <Download className="h-3 w-3" /> CSV
              </Button>
              <Button variant="ghost" size="sm" onClick={onExportPdf} className="gap-1 text-xs">
                <FileText className="h-3 w-3" /> PDF
              </Button>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.by_month.map(m => ({ ...m, label: formatMonthLabel(m.month) }))}>
                <defs>
                  <linearGradient id="patientGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip content={<CountTooltip />} />
                <Area
                  type="monotone"
                  dataKey="new_patients"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#patientGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
