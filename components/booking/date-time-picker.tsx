"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"

interface AvailableSlot {
  time: string
  dentist_id: string | null
  dentist_name: string | null
}

interface DateTimePickerProps {
  slots: AvailableSlot[]
  selectedDate: string | null
  selectedTime: string | null
  onDateChange: (date: string) => void
  onTimeSelect: (time: string) => void
}

export function DateTimePicker({
  slots,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeSelect,
}: DateTimePickerProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay()

  const monthName = currentMonth.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  })

  const prevMonth = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    if (prev >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(prev)
    }
  }

  const nextMonth = () => {
    const maxMonth = new Date(today.getFullYear(), today.getMonth() + 3, 1)
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    if (next <= maxMonth) {
      setCurrentMonth(next)
    }
  }

  const formatDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return date.toISOString().split("T")[0]
  }

  const isDateDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    date.setHours(0, 0, 0, 0)
    return date < today
  }

  const isDateSelected = (day: number) => {
    return formatDate(day) === selectedDate
  }

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Escolha a data e horário</h2>
        <p className="mt-2 text-gray-600">Selecione o melhor dia e horário para sua consulta</p>
      </div>

      {/* Calendar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h3 className="text-lg font-semibold capitalize">{monthName}</h3>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-sm font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the first of the month */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="p-3" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const disabled = isDateDisabled(day)
              const selected = isDateSelected(day)
              const isToday = formatDate(day) === today.toISOString().split("T")[0]

              return (
                <button
                  key={day}
                  disabled={disabled}
                  onClick={() => onDateChange(formatDate(day))}
                  className={`
                    relative p-3 text-center text-sm font-medium rounded-lg transition-all
                    ${disabled
                      ? "text-gray-300 cursor-not-allowed"
                      : selected
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100 text-gray-900"
                    }
                    ${isToday && !selected ? "ring-2 ring-primary ring-offset-2" : ""}
                  `}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Time slots */}
      {selectedDate && (
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Horários disponíveis para{" "}
            {new Date(selectedDate + "T12:00:00").toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h3>

          {slots.length > 0 ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {slots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  className="h-12"
                  onClick={() => onTimeSelect(slot.time)}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center gap-2 py-8 text-center text-gray-500">
                <CalendarIcon className="h-8 w-8 opacity-50" />
                <p>Nenhum horário disponível para esta data.</p>
                <p className="text-sm">Selecione outra data ou outro dentista.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
