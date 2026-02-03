"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useTranslations } from "next-intl"
import dynamic from "next/dynamic"
import {
  Users,
  CalendarCheck,
  CalendarClock,
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal,
  Loader2,
  AlertCircle,
  AlertTriangle
} from "lucide-react"
import Link from "next/link"
import { startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"

const WeeklyFlowChart = dynamic(() => import("@/components/dashboard/weekly-flow-chart"), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full animate-pulse bg-muted rounded" />,
})

export default function DashboardHome() {
  const { data: session } = useSession()
  const t = useTranslations("dashboard")

  // Buscar Estatísticas
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      try {
        const res = await api.get("/clinics/my/stats")
        return res.data?.data || {}
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error)
        return {}
      }
    }
  })

  // Buscar Agendamentos de Hoje
  const { data: todayAppointments, isLoading: loadingAppts } = useQuery({
    queryKey: ["appointments-today"],
    queryFn: async () => {
      try {
        const res = await api.get("/appointments", { params: { date: new Date().toISOString().split('T')[0] } })
        // Unwrap TransformInterceptor: { success, data: { data: [...], meta }, timestamp }
        const payload = res.data?.data || res.data
        const data = payload?.data || payload
        return Array.isArray(data) ? data : []
      } catch (error) {
        console.error("Erro ao buscar agendamentos de hoje:", error)
        return []
      }
    }
  })

  // Buscar Fluxo Semanal
  const { data: weeklyFlow, isLoading: loadingFlow } = useQuery({
    queryKey: ["weekly-flow"],
    queryFn: async () => {
      try {
        const start = startOfWeek(new Date(), { weekStartsOn: 1 })
        const end = endOfWeek(new Date(), { weekStartsOn: 1 })
        
        const res = await api.get("/appointments", { 
          params: { 
            start_date: start.toISOString().split('T')[0],
            end_date: end.toISOString().split('T')[0]
          } 
        })
        
        // Unwrap TransformInterceptor: { success, data: { data: [...], meta }, timestamp }
        const payload = res.data?.data || res.data
        const appointments = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : [])
        const days = eachDayOfInterval({ start, end })
        
        return days.map(day => {
          const count = appointments.filter((a: any) => {
            const apptDate = new Date(a.date_time || a.data)
            return isSameDay(apptDate, day)
          }).length
          
          return {
            name: format(day, 'EEE', { locale: ptBR }),
            valor: count
          }
        })
      } catch (error) {
        console.error("Erro ao buscar fluxo semanal:", error)
        return []
      }
    }
  })

  // Subscription / trial info
  const { data: subscription } = useQuery({
    queryKey: ["subscription-current"],
    queryFn: async () => {
      try {
        const res = await api.get("/subscriptions/current")
        return res.data
      } catch {
        return null
      }
    },
  })

  const trialDaysLeft = subscription?.status === "trialing" && subscription?.trial_end
    ? Math.max(0, Math.ceil((new Date(subscription.trial_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  const isExpired = subscription?.status === "expired"

  if (loadingStats || loadingAppts || loadingFlow) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const appointmentsList = Array.isArray(todayAppointments) ? todayAppointments : []
  const chartData = weeklyFlow || []

  return (
    <div className="space-y-8 pb-12">
      {/* Trial / Expired banner */}
      {trialDaysLeft !== null && trialDaysLeft <= 7 && (
        <div className={cn(
          "flex items-center gap-3 p-4 rounded-xl border",
          trialDaysLeft <= 1 ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800" : "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800"
        )}>
          <AlertTriangle className={cn("h-5 w-5 shrink-0", trialDaysLeft <= 1 ? "text-red-600" : "text-amber-600")} />
          <div className="flex-1">
            <p className={cn("text-sm font-medium", trialDaysLeft <= 1 ? "text-red-800 dark:text-red-200" : "text-amber-800 dark:text-amber-200")}>
              {trialDaysLeft === 0
                ? t("trialBannerToday")
                : t("trialBanner", { days: trialDaysLeft })}
            </p>
            <p className={cn("text-xs mt-0.5", trialDaysLeft <= 1 ? "text-red-600 dark:text-red-300" : "text-amber-600 dark:text-amber-300")}>
              {t("trialSubscribeHint")}
            </p>
          </div>
          <Link href="/settings/billing">
            <Button size="sm" variant={trialDaysLeft <= 1 ? "destructive" : "default"}>
              {t("subscribeNow")}
            </Button>
          </Link>
        </div>
      )}

      {isExpired && (
        <div className="flex items-center gap-3 p-4 rounded-xl border bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">{t("trialExpired")}</p>
            <p className="text-xs mt-0.5 text-red-600 dark:text-red-300">{t("trialExpiredDesc")}</p>
          </div>
          <Link href="/settings/billing">
            <Button size="sm" variant="destructive">{t("subscribeNow")}</Button>
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-1 animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{t("greeting", { name: session?.user?.name || "Doctor" })}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t("subtitle")}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t("totalPatients")}
          value={stats?.total_patients || 0}
          icon={<Users className="text-primary" size={20} />}
          delay={0}
        />
        <MetricCard
          title={t("confirmedToday")}
          value={stats?.confirmed_today || 0}
          icon={<CalendarCheck className="text-success" size={20} />}
          delay={75}
        />
        <MetricCard
          title={t("pendingAppointments")}
          value={stats?.pending_appointments || 0}
          icon={<CalendarClock className="text-amber-500" size={20} />}
          delay={150}
        />
        <MetricCard
          title={t("monthlyRevenue")}
          value={`R$ ${stats?.monthly_revenue?.toLocaleString('pt-BR') || '0,00'}`}
          icon={<TrendingUp className="text-primary" size={20} />}
          delay={225}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 overflow-hidden border-border bg-card shadow-sm animate-fade-in-up opacity-0" style={{ animationDelay: "300ms" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">{t("patientFlow")}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("weeklyFlow")}</p>
            </div>
          </CardHeader>
          <CardContent>
            <WeeklyFlowChart data={chartData} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border bg-card shadow-sm animate-fade-in-up opacity-0" style={{ animationDelay: "375ms" }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">{t("upcomingToday")}</h3>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
              <MoreHorizontal size={20} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {!Array.isArray(todayAppointments) || todayAppointments.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">{t("noAppointmentsToday")}</p>
              ) : (
                todayAppointments.slice(0, 5).map((a: any) => (
                  <div key={a.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center font-bold text-xs text-accent-foreground">
                        {(a.patient_name || a.paciente || "P").charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">{a.patient_name || a.paciente}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{a.service_name || a.servico}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {a.date_time ? format(new Date(a.date_time), 'HH:mm') : a.hora}
                      </p>
                      <Badge 
                        variant={a.status === "Confirmado" ? "green" : "yellow"}
                        className="text-[10px] py-0 h-4 px-1.5"
                      >
                        {a.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button variant="outline" className="w-full mt-6 h-10 font-medium text-gray-900 dark:text-gray-100 hover:bg-accent" onClick={() => window.location.href="/appointments"}>
              {t("viewAll")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon, change, delay = 0 }: { title: string; value: string | number; icon: React.ReactNode; change?: string; delay?: number }) {
  const isPositive = change?.startsWith("+")
  return (
    <Card className="border-border bg-card shadow-sm hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 animate-scale-in opacity-0" style={{ animationDelay: `${delay}ms` }}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-accent/50 text-foreground">
            {icon}
          </div>
          {change && (
            <div className={cn(
              "flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full",
              isPositive ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
            )}>
              {change}
              <ArrowUpRight size={12} />
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
