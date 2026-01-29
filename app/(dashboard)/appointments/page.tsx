"use client"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAppointments } from "@/hooks/useAppointments"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { LayoutList, Calendar as CalendarIcon, Plus, Loader2, CheckCircle, XCircle } from "lucide-react"

const locales = { "pt-BR": ptBR }
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales })

export default function AppointmentsPage() {
  const [view, setView] = useState<"lista" | "calendario">("lista")
  const { appointments, isLoading, confirmAppointment, cancelAppointment } = useAppointments()

  const events = useMemo(
    () =>
      appointments.map((a: any) => {
        const start = new Date(`${a.data}T${a.hora}:00`)
        const end = new Date(start)
        end.setHours(start.getHours() + 1)
        return { 
          id: a.id, 
          title: `${a.paciente} • ${a.servico}`, 
          start, 
          end, 
          resource: a 
        }
      }),
    [appointments]
  )

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Agendamentos</h1>
          <p className="text-sm text-muted-foreground">Gerencie as consultas e horários da clínica.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-muted p-1 rounded-lg flex gap-1">
            <Button 
              variant={view === "lista" ? "default" : "ghost"} 
              size="sm" 
              className="h-8 gap-2"
              onClick={() => setView("lista")}
            >
              <LayoutList size={14} />
              Lista
            </Button>
            <Button 
              variant={view === "calendario" ? "default" : "ghost"} 
              size="sm" 
              className="h-8 gap-2"
              onClick={() => setView("calendario")}
            >
              <CalendarIcon size={14} />
              Calendário
            </Button>
          </div>
          <Button className="gap-2">
            <Plus size={18} />
            Novo Agendamento
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : view === "lista" ? (
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <THead className="bg-muted/50">
                  <TR>
                    <TH className="font-semibold text-foreground">Data/Hora</TH>
                    <TH className="font-semibold text-foreground">Paciente</TH>
                    <TH className="font-semibold text-foreground">Dentista</TH>
                    <TH className="font-semibold text-foreground">Serviço</TH>
                    <TH className="font-semibold text-foreground">Status</TH>
                    <TH className="text-right font-semibold text-foreground">Ações</TH>
                  </TR>
                </THead>
                <TBody>
                  {appointments.length === 0 ? (
                    <TR>
                      <TD colSpan={6} className="h-32 text-center text-muted-foreground">
                        Nenhum agendamento encontrado.
                      </TD>
                    </TR>
                  ) : (
                    appointments.map((a: any) => (
                      <TR key={a.id} className="hover:bg-muted/30 transition-colors">
                        <TD>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{format(new Date(a.data), 'dd/MM/yyyy')}</span>
                            <span className="text-xs text-muted-foreground">{a.hora}</span>
                          </div>
                        </TD>
                        <TD className="font-medium text-foreground">{a.paciente}</TD>
                        <TD className="text-muted-foreground text-sm">{a.dentista}</TD>
                        <TD className="text-muted-foreground text-sm">{a.servico}</TD>
                        <TD>
                          <Badge variant={
                            a.status === "Confirmado" ? "green" : 
                            a.status === "Pendente" ? "yellow" : "red"
                          }>
                            {a.status}
                          </Badge>
                        </TD>
                        <TD className="text-right">
                          <div className="flex justify-end gap-1">
                            {a.status === "Pendente" && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-success hover:bg-success/10"
                                onClick={() => confirmAppointment.mutate(a.id)}
                                title="Confirmar"
                              >
                                <CheckCircle size={14} />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                if (confirm("Cancelar este agendamento?")) cancelAppointment.mutate(a.id)
                              }}
                              title="Cancelar"
                            >
                              <XCircle size={14} />
                            </Button>
                          </div>
                        </TD>
                      </TR>
                    ))
                  )}
                </TBody>
              </Table>
            </div>
          ) : (
            <div className="h-[700px] font-sans">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView="week"
                views={["week", "month"]}
                messages={{
                  week: "Semana",
                  month: "Mês",
                  today: "Hoje",
                  previous: "Anterior",
                  next: "Próximo"
                }}
                className="rounded-lg"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
