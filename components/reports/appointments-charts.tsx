"use client"
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"

interface AppointmentsData {
  total: number
  completed: number
  cancelled: number
  no_show: number
  attendance_rate: number
  cancellation_rate: number
  no_show_rate: number
}

const PIE_COLORS = ["#22c55e", "#ef4444", "#f59e0b", "#3b82f6"]

export default function AppointmentsCharts({
  data,
  onExportCsv,
  onExportPdf,
}: {
  data: AppointmentsData
  onExportCsv: () => void
  onExportPdf: () => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-5">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-2xl font-bold mt-1">{data.total}</p>
        </div>
        <div className="bg-card border rounded-xl p-5">
          <p className="text-xs text-muted-foreground">Taxa Comparecimento</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{data.attendance_rate}%</p>
        </div>
        <div className="bg-card border rounded-xl p-5">
          <p className="text-xs text-muted-foreground">Taxa Cancelamento</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{data.cancellation_rate}%</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Resumo por status</p>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onExportCsv} className="gap-1 text-xs">
              <Download className="h-3 w-3" /> CSV
            </Button>
            <Button variant="ghost" size="sm" onClick={onExportPdf} className="gap-1 text-xs">
              <FileText className="h-3 w-3" /> PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Realizados", value: data.completed },
                    { name: "Cancelados", value: data.cancelled },
                    { name: "Faltas", value: data.no_show },
                    { name: "Agendados", value: Math.max(0, data.total - data.completed - data.cancelled - data.no_show) },
                  ].filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {PIE_COLORS.map((color, i) => (
                    <Cell key={i} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 content-center">
            {[
              { label: "Realizados", value: data.completed, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
              { label: "Cancelados", value: data.cancelled, color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
              { label: "Faltas", value: data.no_show, color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
              { label: "Agendados", value: data.total - data.completed - data.cancelled - data.no_show, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
            ].map((item) => (
              <div key={item.label} className={`rounded-lg p-3 text-center ${item.color}`}>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
