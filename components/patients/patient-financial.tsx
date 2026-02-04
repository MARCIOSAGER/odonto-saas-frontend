"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { api } from "@/lib/api"
import {
  Loader2,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  FileText,
} from "lucide-react"

interface FinancialSummary {
  completed_total: number
  pending_total: number
  cancelled_total: number
  completed_count: number
  pending_count: number
  cancelled_count: number
  treatment_plan_total: number
  active_plans_count: number
  total_appointments: number
}

interface AppointmentItem {
  id: string
  date: string
  time: string
  status: string
  notes: string | null
  service: { id: string; name: string; price: number } | null
  dentist: { id: string; name: string } | null
}

interface TreatmentPlanItem {
  id: string
  status: string
  total_cost: number | null
  total_sessions: number | null
  created_at: string
  notes: string | null
}

interface FinancialData {
  summary: FinancialSummary
  appointments: AppointmentItem[]
  treatment_plans: TreatmentPlanItem[]
}

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-800",
  confirmed: "bg-blue-100 text-blue-800",
  scheduled: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
  no_show: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function PatientFinancial({ patientId }: { patientId: string }) {
  const t = useTranslations("patientDetail")
  const [data, setData] = useState<FinancialData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const statusLabels: Record<string, string> = {
    scheduled: t("statusScheduled"),
    confirmed: t("statusConfirmed"),
    completed: t("statusCompleted"),
    cancelled: t("statusCancelled"),
    no_show: t("statusNoShow"),
    pending: t("statusPending"),
    in_progress: t("statusInProgress"),
  }

  const planStatusLabels: Record<string, string> = {
    pending: t("planStatusPending"),
    in_progress: t("planStatusInProgress"),
    completed: t("planStatusCompleted"),
    cancelled: t("planStatusCancelled"),
  }

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await api.get(`/patients/${patientId}/financial`)
        setData(res.data?.data || res.data)
      } catch {
        setError(t("financialLoadError"))
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

  if (error || !data) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        {error || t("financialNoData")}
      </div>
    )
  }

  const { summary, appointments, treatment_plans } = data

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-muted-foreground">{t("financialCompleted")}</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {formatCurrency(summary.completed_total)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("financialCompletedCount", { count: summary.completed_count })}
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-muted-foreground">{t("financialPending")}</span>
          </div>
          <p className="text-2xl font-bold text-yellow-700">
            {formatCurrency(summary.pending_total)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("financialPendingCount", { count: summary.pending_count })}
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-muted-foreground">{t("financialTreatmentPlans")}</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {formatCurrency(summary.treatment_plan_total)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("financialActivePlans", { count: summary.active_plans_count })}
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-muted-foreground">{t("financialGrandTotal")}</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {formatCurrency(summary.completed_total + summary.pending_total)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("financialTotalAppointments", { count: summary.total_appointments })}
          </p>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          {t("financialHistory")}
        </h3>
        {appointments.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {t("financialNoAppointments")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">{t("financialDate")}</th>
                  <th className="pb-2 font-medium">{t("financialService")}</th>
                  <th className="pb-2 font-medium">{t("financialDentist")}</th>
                  <th className="pb-2 font-medium">{t("financialStatus")}</th>
                  <th className="pb-2 font-medium text-right">{t("financialValue")}</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.id} className="border-b last:border-0">
                    <td className="py-2.5">
                      {new Date(apt.date).toLocaleDateString("pt-BR")}{" "}
                      <span className="text-muted-foreground">{apt.time}</span>
                    </td>
                    <td className="py-2.5">{apt.service?.name || "-"}</td>
                    <td className="py-2.5">
                      {apt.dentist ? `${t("financialDrPrefix")}${apt.dentist.name}` : "-"}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          statusColors[apt.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {statusLabels[apt.status] || apt.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-medium">
                      {apt.service?.price
                        ? formatCurrency(Number(apt.service.price))
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t font-semibold">
                  <td colSpan={4} className="py-2.5">
                    {t("financialTotalCompleted")}
                  </td>
                  <td className="py-2.5 text-right text-green-700">
                    {formatCurrency(summary.completed_total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Treatment Plans */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {t("financialTreatmentPlans")}
        </h3>
        {treatment_plans.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {t("financialNoTreatmentPlans")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">{t("financialDate")}</th>
                  <th className="pb-2 font-medium">{t("financialStatus")}</th>
                  <th className="pb-2 font-medium">{t("financialSessions")}</th>
                  <th className="pb-2 font-medium">{t("financialNotes")}</th>
                  <th className="pb-2 font-medium text-right">{t("financialEstimatedValue")}</th>
                </tr>
              </thead>
              <tbody>
                {treatment_plans.map((plan) => (
                  <tr key={plan.id} className="border-b last:border-0">
                    <td className="py-2.5">
                      {new Date(plan.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          statusColors[plan.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {planStatusLabels[plan.status] || plan.status}
                      </span>
                    </td>
                    <td className="py-2.5">
                      {plan.total_sessions ?? "-"}
                    </td>
                    <td className="py-2.5 max-w-[200px] truncate">
                      {plan.notes || "-"}
                    </td>
                    <td className="py-2.5 text-right font-medium">
                      {plan.total_cost != null
                        ? formatCurrency(Number(plan.total_cost))
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t font-semibold">
                  <td colSpan={4} className="py-2.5">
                    {t("financialTotalEstimated")}
                  </td>
                  <td className="py-2.5 text-right text-blue-700">
                    {formatCurrency(summary.treatment_plan_total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Cancelled summary */}
      {summary.cancelled_count > 0 && (
        <div className="border rounded-lg p-4 bg-red-50/50">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-700">
              {t("financialCancelledCount", { count: summary.cancelled_count, value: formatCurrency(summary.cancelled_total) })}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
