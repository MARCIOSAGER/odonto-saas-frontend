"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState, useMemo, useEffect, useCallback, Suspense } from "react"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAppointments } from "@/hooks/useAppointments"
import { format } from "date-fns"
import { LayoutList, Calendar as CalendarIcon, Plus, Loader2, CheckCircle, XCircle, Pencil, Trash2 } from "lucide-react"

const CalendarView = dynamic(() => import("@/components/appointments/calendar-view"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[700px] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
})
import { AppointmentForm } from "@/components/forms/appointment-form"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
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

const statusKeys: Record<string, string> = {
  scheduled: "scheduled",
  confirmed: "confirmed",
  completed: "completed",
  cancelled: "cancelled",
  "no-show": "noShow",
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
function getStatusKey(a: any): string {
  return statusKeys[a.status] || "scheduled"
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
  const t = useTranslations("appointments")
  const tc = useTranslations("common")
  const searchParams = useSearchParams()
  const isMobile = useIsMobile()
  const [view, setView] = useState<"lista" | "calendario">("lista")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [dragEvent, setDragEvent] = useState<{ id: string; date: string; time: string; label: string } | null>(null)
  const [prefillDateTime, setPrefillDateTime] = useState<{ date: string; time: string } | null>(null)
  const { appointments, isLoading, isError, createAppointment, confirmAppointment, cancelAppointment, updateAppointment, rescheduleAppointment } = useAppointments()

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
    setPrefillDateTime(null)
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

  const handleEventDrop = useCallback(({ event, start }: { event: any; start: any }) => {
    const newDate = format(new Date(start), "yyyy-MM-dd")
    const newTime = format(new Date(start), "HH:mm")
    const label = `${format(new Date(start), "dd/MM/yyyy")} ${t("at")} ${newTime}`
    setDragEvent({ id: event.id, date: newDate, time: newTime, label })
  }, [t])

  const handleConfirmDrag = async () => {
    if (!dragEvent) return
    try {
      await rescheduleAppointment.mutateAsync({
        id: dragEvent.id,
        date: dragEvent.date,
        time: dragEvent.time,
      })
    } catch {
      // Error handled in hook
    } finally {
      setDragEvent(null)
    }
  }

  const handleSelectSlot = useCallback(({ start }: { start: Date }) => {
    const date = format(start, "yyyy-MM-dd")
    const time = format(start, "HH:mm")
    setPrefillDateTime({ date, time })
    setEditingItem(null)
    setIsModalOpen(true)
  }, [])

  const draggableAccessor = useCallback((event: any) => {
    const status = event.resource?.status?.toLowerCase() || ""
    return status !== "cancelled" && status !== "completed" && status !== "cancelado" && status !== "concluido" && status !== "realizado"
  }, [])

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
        <div className="text-destructive font-medium">{tc("errorLoad")}</div>
        <Button onClick={() => window.location.reload()} variant="outline">
          {tc("tryAgain")}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{t("title")}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("subtitle")}</p>
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
              {t("listView")}
            </Button>
            <Button
              variant={view === "calendario" ? "default" : "ghost"}
              size="sm"
              className="h-8 gap-2"
              onClick={() => setView("calendario")}
            >
              <CalendarIcon size={14} />
              {t("calendarView")}
            </Button>
          </div>
          <Button className="gap-2" onClick={handleCreate}>
            <Plus size={18} />
            {t("newAppointment")}
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              {editingItem ? t("editAppointment") : t("newAppointment")}
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              {editingItem ? t("formSubtitleEdit") : t("formSubtitleNew")}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-0">
            <AppointmentForm
              initialData={editingItem}
              prefillDateTime={prefillDateTime}
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
            <AlertDialogTitle>{t("cancelConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("cancelConfirmMessage")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tc("back")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {t("confirmCancellation")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!dragEvent} onOpenChange={() => setDragEvent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("rescheduleTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("rescheduleMessage", { label: dragEvent?.label || "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tc("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDrag} disabled={rescheduleAppointment.isPending}>
              {rescheduleAppointment.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {tc("confirm")}
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
                    <TH className="font-bold text-gray-900 dark:text-gray-100">{t("dateTime")}</TH>
                    <TH className="font-bold text-gray-900 dark:text-gray-100">{t("patient")}</TH>
                    <TH className="font-bold text-gray-900 dark:text-gray-100">{t("dentist")}</TH>
                    <TH className="font-bold text-gray-900 dark:text-gray-100">{t("service")}</TH>
                    <TH className="font-bold text-gray-900 dark:text-gray-100">{tc("status")}</TH>
                    <TH className="text-right font-bold text-gray-900 dark:text-gray-100">{tc("actions")}</TH>
                  </TR>
                </THead>
                <TBody>
                  {safeAppointments.length === 0 ? (
                    <TR>
                      <TD colSpan={6} className="h-32 text-center text-gray-500 dark:text-gray-400">
                        {t("noAppointments")}
                      </TD>
                    </TR>
                  ) : (
                    safeAppointments.map((a: any) => {
                      const aptDate = getAppointmentDate(a)
                      const statusKey = getStatusKey(a)
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
                              {t(statusKey)}
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
                                  title={tc("confirm")}
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
                                title={tc("edit")}
                              >
                                <Pencil size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-destructive dark:text-gray-400"
                                onClick={() => setDeleteId(a.id)}
                                title={tc("cancel")}
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
            <CalendarView
              events={events}
              isMobile={isMobile}
              onSelectSlot={handleSelectSlot}
              onEventDrop={handleEventDrop}
              draggableAccessor={draggableAccessor}
            />
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
