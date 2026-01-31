"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAppointments } from "@/hooks/useAppointments"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { LayoutList, Calendar as CalendarIcon, Plus, Loader2, CheckCircle, XCircle, Pencil, Trash2 } from "lucide-react"
import { AppointmentForm } from "@/components/forms/appointment-form"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/useIsMobile"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const locales = { "pt-BR": ptBR }
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales })

const statusMap: Record<string, string> = {
  scheduled: "Agendado",
  confirmed: "Confirmado",
  completed: "Realizado",
  cancelled: "Cancelado",
  "no-show": "Faltou",
}

const statusVariant = (status: string): "green" | "yellow" | "red" => {
  const s = status?.toLowerCase() || ""
  if (s === "confirmed" || s === "confirmado") return "green"
  if (s === "scheduled" || s === "agendado" || s === "pendente") return "yellow"
  return "red"
}

function getPatientName(a: any): string {
  return a.patient?.name || a.patient_name || a.paciente || ""
}
function getDentistName(a: any): string {
  return a.dentist?.name || a.dentist_name || a.dentista || ""
}
function getServiceName(a: any): string {
  return a.service?.name || a.service_name || a.servico || ""
}
function getStatusLabel(a: any): string {
  return statusMap[a.status] || a.status || "Agendado"
}
function getAppointmentDate(a: any): Date {
  if (a.date_time) return new Date(a.date_time)
  if (a.date && a.time) {
    const dateStr = typeof a.date === "string" ? a.date.split("T")[0] : new Date(a.date).toISOString().split("T")[0]
    return new Date(`${dateStr}T${a.time}:00`)
  }
  if (a.date) return new Date(a.date)
  return new Date()
}

function AppointmentsContent() {
  const searchParams = useSearchParams()
  const isMobile = useIsMobile()
  const [view, setView] = useState<"lista" | "calendario">("lista")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { appointments, isLoading, isError, createAppointment, confirmAppointment, cancelAppointment, updateAppointment } = useAppointments()

  const safeAppointments = useMemo(() => {
    if (!appointments) return []
    if (Array.isArray(appointments)) return appointments
    return []
  }, [appointments])

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setIsModalOpen(true)
      window.history.replaceState({}, "", "/appointments")
    }
  }, [searchParams])

  const handleCreate = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingItem) {
        await updateAppointment.mutateAsync({ id: editingItem.id, ...data })
      } else {
        await createAppointment.mutateAsync(data)
      }
      setIsModalOpen(false)
      setEditingItem(null)
    } catch (error) {
      // Erro já tratado no hook
    }
  }

  const handleConfirm = async (id: string) => {
    try {
      await confirmAppointment.mutateAsync(id)
    } catch (error) {
      // Erro já tratado no hook
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await cancelAppointment.mutateAsync(deleteId)
    } catch (error) {
      // Erro já tratado no hook
    } finally {
      setDeleteId(null)
    }
  }

  const events = useMemo(
    () =>
      safeAppointments.map((a: any) => {
        const start = getAppointmentDate(a)
        const end = new Date(start)
        const duration = a.duration || a.service?.duration || 60
        end.setMinutes(start.getMinutes() + duration)
        return {
          id: a.id,
          title: `${getPatientName(a)} - ${getServiceName(a)}`,
          start,
          end,
          resource: a
        }
      }),
    [safeAppointments]
  )

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-destructive font-medium">Erro ao carregar agendamentos</div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Agendamentos</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie as consultas e horários da clínica.</p>
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
          <Button className="gap-2" onClick={handleCreate}>
            <Plus size={18} />
            Novo Agendamento
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              {editingItem ? "Editar Agendamento" : "Novo Agendamento"}
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              {editingItem
                ? "Atualize as informações da consulta selecionada."
                : "Selecione o paciente, dentista e serviço para marcar uma nova consulta."}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-0">
            <AppointmentForm
              initialData={editingItem}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsModalOpen(false)}
              loading={createAppointment.isPending || updateAppointment.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta consulta? Esta ação removerá o horário da agenda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : view === "lista" ? (
            <div className="rounded-md border border-border overflow-x-auto">
              <Table className="min-w-[700px]">
                <THead className="bg-muted/50">
                  <TR>
                    <TH className="font-bold text-gray-900 dark:text-gray-100">Data/Hora</TH>
                    <TH className="font-bold text-gray-900 dark:text-gray-100">Paciente</TH>
                    <TH className="font-bold text-gray-900 dark:text-gray-100">Dentista</TH>
                    <TH className="font-bold text-gray-900 dark:text-gray-100">Serviço</TH>
                    <TH className="font-bold text-gray-900 dark:text-gray-100">Status</TH>
                    <TH className="text-right font-bold text-gray-900 dark:text-gray-100">Ações</TH>
                  </TR>
                </THead>
                <TBody>
                  {safeAppointments.length === 0 ? (
                    <TR>
                      <TD colSpan={6} className="h-32 text-center text-gray-500 dark:text-gray-400">
                        Nenhum agendamento encontrado.
                      </TD>
                    </TR>
                  ) : (
                    safeAppointments.map((a: any) => {
                      const aptDate = getAppointmentDate(a)
                      const label = getStatusLabel(a)
                      const isScheduled = a.status === "scheduled"
                      return (
                        <TR key={a.id} className="hover:bg-muted/30 transition-colors">
                          <TD>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900 dark:text-gray-100">
                                {format(aptDate, 'dd/MM/yyyy')}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {a.time || format(aptDate, 'HH:mm')}
                              </span>
                            </div>
                          </TD>
                          <TD className="font-semibold text-gray-900 dark:text-gray-100">{getPatientName(a)}</TD>
                          <TD className="text-gray-700 dark:text-gray-300 text-sm">{getDentistName(a)}</TD>
                          <TD className="text-gray-700 dark:text-gray-300 text-sm">{getServiceName(a)}</TD>
                          <TD>
                            <Badge variant={statusVariant(a.status)}>
                              {label}
                            </Badge>
                          </TD>
                          <TD className="text-right">
                            <div className="flex justify-end gap-1">
                              {isScheduled && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-success hover:bg-success/10"
                                  onClick={() => handleConfirm(a.id)}
                                  title="Confirmar"
                                  disabled={confirmAppointment.isPending}
                                >
                                  {confirmAppointment.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-primary dark:text-gray-400"
                                onClick={() => handleEdit(a)}
                                title="Editar"
                              >
                                <Pencil size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-destructive dark:text-gray-400"
                                onClick={() => setDeleteId(a.id)}
                                title="Cancelar"
                                disabled={cancelAppointment.isPending}
                              >
                                {cancelAppointment.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                              </Button>
                            </div>
                          </TD>
                        </TR>
                      )
                    })
                  )}
                </TBody>
              </Table>
            </div>
          ) : (
            <div className={cn("font-sans", isMobile ? "h-[450px]" : "h-[700px]")}>
              <Calendar
                localizer={localizer}
                culture="pt-BR"
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView={isMobile ? "day" : "week"}
                views={isMobile ? ["day", "month"] : ["week", "month"]}
                messages={{
                  day: "Dia",
                  week: "Semana",
                  month: "Mês",
                  today: "Hoje",
                  previous: "Anterior",
                  next: "Próximo",
                  date: "Data",
                  time: "Hora",
                  event: "Evento",
                  noEventsInRange: "Sem agendamentos neste período.",
                  showMore: (total: number) => `+${total} mais`,
                }}
                formats={{
                  timeGutterFormat: (date: Date) => format(date, 'HH:mm', { locale: ptBR }),
                  eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
                    `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`,
                  dayHeaderFormat: (date: Date) => format(date, "EEEE, dd 'de' MMMM", { locale: ptBR }),
                  dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
                    `${format(start, "dd 'de' MMMM", { locale: ptBR })} - ${format(end, "dd 'de' MMMM", { locale: ptBR })}`,
                }}
                className="rounded-lg"
                eventPropGetter={(event: any) => {
                  const status = event.resource?.status?.toLowerCase() || ""
                  let backgroundColor = 'hsl(var(--primary))'
                  let opacity = 1

                  if (status === "confirmed" || status === "confirmado") {
                    backgroundColor = '#16a34a'
                  } else if (status === "cancelled" || status === "cancelado") {
                    backgroundColor = '#dc2626'
                    opacity = 0.5
                  } else if (status === "completed" || status === "concluido" || status === "realizado") {
                    backgroundColor = '#6b7280'
                  } else if (status === "no-show" || status === "faltou") {
                    backgroundColor = '#f59e0b'
                    opacity = 0.6
                  }

                  return {
                    style: {
                      backgroundColor,
                      borderRadius: '6px',
                      border: 'none',
                      color: 'white',
                      fontSize: '12px',
                      padding: '2px 6px',
                      opacity,
                      textDecoration: (status === "cancelled" || status === "cancelado") ? 'line-through' : 'none',
                    }
                  }
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <AppointmentsContent />
    </Suspense>
  )
}
