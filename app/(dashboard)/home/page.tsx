"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
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

export default function DashboardHome() {
  const { data: session } = useSession()

  // Buscar Estatísticas
  const { data: stats, isLoading: loadingStats, isError: errorStats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await api.get("/clinics/my/stats")
      return res.data?.data || {}
    }
  })

  // Buscar Agendamentos de Hoje
  const { data: todayAppointments, isLoading: loadingAppts, isError: errorAppts } = useQuery({
    queryKey: ["appointments-today"],
    queryFn: async () => {
      const res = await api.get("/appointments", { params: { date: new Date().toISOString().split('T')[0] } })
      return res.data?.data || []
    }
  })

  if (loadingStats || loadingAppts) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (errorStats || errorAppts) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Erro ao carregar Dashboard</h2>
          <p className="text-muted-foreground text-sm">Não foi possível conectar com a API. Verifique sua conexão.</p>
        </div>
        <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
      </div>
    )
  }

  const chartData = [
    { name: 'Seg', valor: 12 },
    { name: 'Ter', valor: 18 },
    { name: 'Qua', valor: 15 },
    { name: 'Qui', valor: 22 },
    { name: 'Sex', valor: 30 },
    { name: 'Sáb', valor: 10 },
  ]

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Olá, {session?.user?.name || "Doutor"}</h1>
        <p className="text-muted-foreground">Aqui está o que está acontecendo na sua clínica hoje.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total de Pacientes" 
          value={stats?.total_patients || 0} 
          change="+12.5%"
          icon={<Users className="text-primary" size={20} />} 
        />
        <MetricCard 
          title="Confirmados Hoje" 
          value={stats?.confirmed_today || 0} 
          change="+4"
          icon={<CalendarCheck className="text-success" size={20} />} 
        />
        <MetricCard 
          title="Agendamentos Pendentes" 
          value={stats?.pending_appointments || 0} 
          change="-2"
          icon={<CalendarClock className="text-amber-500" size={20} />} 
        />
        <MetricCard 
          title="Faturamento Mensal" 
          value={`R$ ${stats?.monthly_revenue?.toLocaleString('pt-BR') || '0,00'}`} 
          change="+18.2%"
          icon={<TrendingUp className="text-primary" size={20} />} 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 overflow-hidden border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">Fluxo de Pacientes</h3>
              <p className="text-sm text-muted-foreground">Desempenho da clínica nesta semana.</p>
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
            <h3 className="text-lg font-semibold tracking-tight text-foreground">Próximos Hoje</h3>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal size={20} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {!Array.isArray(todayAppointments) || todayAppointments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhum agendamento para hoje.</p>
              ) : (
                todayAppointments.slice(0, 5).map((a: any) => (
                  <div key={a.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center font-bold text-xs text-accent-foreground">
                        {a.paciente?.charAt(0) || "P"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{a.paciente}</p>
                        <p className="text-xs text-muted-foreground">{a.servico}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{a.hora}</p>
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
            <Button variant="outline" className="w-full mt-6 h-10 font-medium text-foreground hover:bg-accent" onClick={() => window.location.href="/appointments"}>
              Ver agenda completa
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon, change }: { title: string; value: string | number; icon: React.ReactNode; change: string }) {
  const isPositive = change.startsWith("+")
  return (
    <Card className="border-border bg-card shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-accent/50 text-foreground">
            {icon}
          </div>
          <div className={cn(
            "flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full",
            isPositive ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
          )}>
            {change}
            <ArrowUpRight size={12} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
