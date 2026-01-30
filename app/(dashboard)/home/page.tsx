"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { 
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { 
  Users, 
  CalendarCheck, 
  CalendarClock, 
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal,
  Loader2,
  AlertCircle
} from "lucide-react"
import { startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function DashboardHome() {
  const { data: session } = useSession()

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
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Olá, {session?.user?.name || "Doutor"}</h1>
        <p className="text-gray-500 dark:text-gray-400">Aqui está o que está acontecendo na sua clínica hoje.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total de Pacientes" 
          value={stats?.total_patients || 0} 
          icon={<Users className="text-primary" size={20} />} 
        />
        <MetricCard 
          title="Confirmados Hoje" 
          value={stats?.confirmed_today || 0} 
          icon={<CalendarCheck className="text-success" size={20} />} 
        />
        <MetricCard 
          title="Agendamentos Pendentes" 
          value={stats?.pending_appointments || 0} 
          icon={<CalendarClock className="text-amber-500" size={20} />} 
        />
        <MetricCard 
          title="Faturamento Mensal" 
          value={`R$ ${stats?.monthly_revenue?.toLocaleString('pt-BR') || '0,00'}`} 
          icon={<TrendingUp className="text-primary" size={20} />} 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 overflow-hidden border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">Fluxo de Pacientes</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Desempenho da clínica nesta semana.</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="valor" 
                    stroke="#0EA5E9" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">Próximos Hoje</h3>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
              <MoreHorizontal size={20} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {!Array.isArray(todayAppointments) || todayAppointments.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">Nenhum agendamento para hoje.</p>
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
              Ver agenda completa
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon, change }: { title: string; value: string | number; icon: React.ReactNode; change?: string }) {
  const isPositive = change?.startsWith("+")
  return (
    <Card className="border-border bg-card shadow-sm hover:shadow-md transition-all duration-200">
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
