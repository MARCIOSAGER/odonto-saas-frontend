"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Stethoscope, Phone, Mail, Loader2, CheckCircle } from "lucide-react"

interface Clinic {
  id: string
  name: string
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
}

interface Service {
  id: string
  name: string
  duration: number
  price: number
}

interface Dentist {
  id: string
  name: string
  specialty: string | null
}

interface PatientData {
  name: string
  phone: string
  cpf?: string
  email?: string
}

interface BookingSummaryProps {
  clinic: Clinic
  service: Service
  dentist: Dentist | null
  date: string
  time: string
  patient: PatientData
  notes: string
  onConfirm: () => void
  submitting: boolean
}

export function BookingSummary({
  clinic,
  service,
  dentist,
  date,
  time,
  patient,
  notes,
  onConfirm,
  submitting,
}: BookingSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatPhone = (value: string) => {
    if (value.length === 11) {
      return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`
    }
    if (value.length === 10) {
      return `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`
    }
    return value
  }

  const formattedDate = new Date(date + "T12:00:00").toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Confirmar agendamento</h2>
        <p className="mt-2 text-gray-600">Revise os detalhes antes de confirmar</p>
      </div>

      <Card>
        <CardContent className="divide-y p-0">
          {/* Clinic info */}
          <div className="p-6">
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
              Clínica
            </h3>
            <p className="text-lg font-semibold text-gray-900">{clinic.name}</p>
            {clinic.address && (
              <p className="mt-1 text-sm text-gray-600">
                {clinic.address}
                {clinic.city && `, ${clinic.city}`}
                {clinic.state && ` - ${clinic.state}`}
              </p>
            )}
          </div>

          {/* Service info */}
          <div className="p-6">
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
              Serviço
            </h3>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <p className="text-lg font-semibold text-gray-900">{service.name}</p>
                </div>
                <p className="mt-1 text-sm text-gray-600">Duração: {service.duration} minutos</p>
              </div>
              <p className="text-lg font-semibold text-primary">{formatCurrency(service.price)}</p>
            </div>
          </div>

          {/* Date and time */}
          <div className="p-6">
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
              Data e horário
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <p className="text-lg font-semibold capitalize text-gray-900">{formattedDate}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <p className="text-lg font-semibold text-gray-900">{time}</p>
              </div>
            </div>
          </div>

          {/* Dentist */}
          <div className="p-6">
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
              Dentista
            </h3>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <p className="text-lg font-semibold text-gray-900">
                {dentist?.name || "Dentista disponível"}
              </p>
            </div>
            {dentist?.specialty && (
              <p className="ml-7 text-sm text-gray-600">{dentist.specialty}</p>
            )}
          </div>

          {/* Patient info */}
          <div className="p-6">
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
              Seus dados
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-400" />
                <p className="text-gray-900">{patient.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-400" />
                <p className="text-gray-900">{formatPhone(patient.phone)}</p>
              </div>
              {patient.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-900">{patient.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {notes && (
            <div className="p-6">
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
                Observações
              </h3>
              <p className="text-gray-700">{notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Button
        onClick={onConfirm}
        disabled={submitting}
        size="lg"
        className="w-full gap-2"
      >
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Confirmando...
          </>
        ) : (
          <>
            <CheckCircle className="h-5 w-5" />
            Confirmar agendamento
          </>
        )}
      </Button>

      <p className="text-center text-xs text-gray-500">
        Ao confirmar, você concorda com nossos termos de uso e política de privacidade.
      </p>
    </div>
  )
}
