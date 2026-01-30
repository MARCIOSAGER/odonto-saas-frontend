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

function AppointmentsContent() {
  const searchParams = useSearchParams()
  const [view, setView] = useState<"lista" | "calendario">("lista")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { appointments, isLoading, createAppointment, confirmAppointment, cancelAppointment, updateAppointment } = useAppointments()

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setIsModalOpen(true)
      // Limpar o param da URL sem recarregar a página
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
      Array.isArray(appointments) 
        ? appointments.map((a: any) => {
            const start = new Date(a.date_time || `${a.date}T${a.hora}:00`)
            const end = new Date(start)
            end.setHours(start.getHours() + 1)
            return { 
              id: a.id, 
              title: `${a.patient_name || a.paciente} • ${a.service_name || a.servico}`, 
              start, 
              end, 
              resource: a 
            }
          })
        : [],
    [appointments]
  )

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
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
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
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
                  {!Array.isArray(appointments) || appointments.length === 0 ? (
                    <TR>
                      <TD colSpan={6} className="h-32 text-center text-gray-500 dark:text-gray-400">
                        Nenhum agendamento encontrado.
                      </TD>
                    </TR>
                  ) : (
                    appointments.map((a: any) => (
                      <TR key={a.id} className="hover:bg-muted/30 transition-colors">
                        <TD>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {format(new Date(a.date_time || a.data), 'dd/MM/yyyy')}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {a.date_time ? format(new Date(a.date_time), 'HH:mm') : a.hora}
                            </span>
                          </div>
                        </TD>
                        <TD className="font-semibold text-gray-900 dark:text-gray-100">{a.patient_name || a.paciente}</TD>
                        <TD className="text-gray-700 dark:text-gray-300 text-sm">{a.dentist_name || a.dentista}</TD>
                        <TD className="text-gray-700 dark:text-gray-300 text-sm">{a.service_name || a.servico}</TD>
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
