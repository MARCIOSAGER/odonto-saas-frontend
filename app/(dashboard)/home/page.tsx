"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useGlobalStore } from "@/lib/store"
import { mockAppointments } from "@/lib/mock"
import { cn } from "@/lib/utils"
import { 
  LineChart, 
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"
import { 
  Users, 
  CalendarCheck, 
  CalendarClock, 
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal
} from "lucide-react"

type Appointment = {
  id: string
  data: string
  hora: string
  paciente: string
  dentista: string
  servico: string
  status: "Confirmado" | "Pendente" | "Cancelado"
}

export default function DashboardHome() {
  const mockMode = useGlobalStore((s) => s.mockMode)
  const { data } = useQuery<Appointment[]>({
    queryKey: ["appointments", "upcoming"],
    queryFn: async () => {
      try {
        const res = await api.get("/api/appointments?range=30")
        return res.data
      } catch {
        return mockAppointments
      }
    }
  })

  const appointments = data || []
  const confirmedCount = appointments.filter((a) => a.status === "Confirmado").length
  const pendingCount = appointments.filter((a) => a.status === "Pendente").length
  
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
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Olá, Dr. Silva</h1>
        <p className="text-muted-foreground">Aqui está o que está acontecendo na sua clínica hoje.</p>
      </div>

      {mockMode && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-sm text-amber-700 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          Modo de demonstração: Exibindo dados simulados.
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total de Pacientes" 
          value="1,284" 
          change="+12.5%"
          icon={<Users className="text-primary" size={20} />} 
        />
        <MetricCard 
          title="Confirmados Hoje" 
          value={confirmedCount} 
          change="+4"
          icon={<CalendarCheck className="text-success" size={20} />} 
        />
        <MetricCard 
          title="Agendamentos Pendentes" 
          value={pendingCount} 
          change="-2"
          icon={<CalendarClock className="text-amber-500" size={20} />} 
        />
        <MetricCard 
          title="Faturamento Mensal" 
          value="R$ 42.500" 
          change="+18.2%"
          icon={<TrendingUp className="text-primary" size={20} />} 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Chart Section */}
        <Card className="lg:col-span-4 overflow-hidden border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold tracking-tight">Fluxo de Pacientes</h3>
              <p className="text-sm text-muted-foreground">Desempenho da clínica nesta semana.</p>
            </div>
            <Button variant="outline" size="sm">Download</Button>
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

        {/* Recent Activity Section */}
        <Card className="lg:col-span-3 border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold tracking-tight">Próximos Hoje</h3>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <MoreHorizontal size={20} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {appointments.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center font-bold text-xs text-accent-foreground">
                      {a.paciente.charAt(0)}
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
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 h-10 font-medium">Ver agenda completa</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon, change }: { title: string; value: string | number; icon: React.ReactNode; change: string }) {
  const isPositive = change.startsWith("+")
  return (
    <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
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
