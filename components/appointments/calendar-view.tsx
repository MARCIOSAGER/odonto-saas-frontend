"use client"
import { useCallback } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

const DnDCalendar = withDragAndDrop(Calendar)
const locales = { "pt-BR": ptBR }
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales })

interface CalendarViewProps {
  events: { id: string; title: string; start: Date; end: Date; resource: any }[]
  isMobile: boolean
  onSelectSlot: (slotInfo: { start: Date }) => void
  onEventDrop: (args: { event: any; start: any }) => void
  draggableAccessor: (event: any) => boolean
}

export default function CalendarView({ events, isMobile, onSelectSlot, onEventDrop, draggableAccessor }: CalendarViewProps) {
  return (
    <div className={cn("font-sans", isMobile ? "h-[450px]" : "h-[700px]")}>
      <DnDCalendar
        localizer={localizer}
        culture="pt-BR"
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView={isMobile ? "day" : "week"}
        views={isMobile ? ["day", "month"] : ["day", "week", "month"]}
        selectable
        onSelectSlot={onSelectSlot}
        onEventDrop={onEventDrop}
        onEventResize={() => {}}
        resizable={false}
        draggableAccessor={draggableAccessor}
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
              cursor: draggableAccessor({ resource: event.resource } as any) ? 'grab' : 'default',
              textDecoration: (status === "cancelled" || status === "cancelado") ? 'line-through' : 'none',
            }
          }
        }}
      />
    </div>
  )
}
