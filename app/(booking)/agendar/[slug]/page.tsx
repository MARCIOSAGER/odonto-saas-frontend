"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ServiceSelector } from "@/components/booking/service-selector"
import { DentistSelector } from "@/components/booking/dentist-selector"
import { DateTimePicker } from "@/components/booking/date-time-picker"
import { PatientForm } from "@/components/booking/patient-form"
import { BookingSummary } from "@/components/booking/booking-summary"
import { CheckCircle, ArrowLeft, Loader2 } from "lucide-react"
import Image from "next/image"

interface Clinic {
  id: string
  name: string
  slug: string
  logo_url: string | null
  favicon_url: string | null
  primary_color: string | null
  secondary_color: string | null
  slogan: string | null
  tagline: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  business_hours: any
}

interface Service {
  id: string
  name: string
  description: string | null
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

interface AvailableSlot {
  time: string
  dentist_id: string | null
  dentist_name: string | null
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1"

type Step = "service" | "dentist" | "datetime" | "patient" | "confirm" | "success"

const STEPS: Step[] = ["service", "dentist", "datetime", "patient", "confirm"]

export default function BookingPage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params)
  const router = useRouter()

  const [clinic, setClinic] = useState<Clinic | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentStep, setCurrentStep] = useState<Step>("service")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [bookingResult, setBookingResult] = useState<any>(null)

  // Fetch clinic data
  useEffect(() => {
    async function fetchClinic() {
      try {
        const res = await fetch(`${API_URL}/booking/${params.slug}`)
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.message || "Clínica não encontrada")
        }
        const data = await res.json()
        setClinic(data.data || data)
      } catch (err: any) {
        setError(err.message)
      }
    }
    fetchClinic()
  }, [params.slug])

  // Fetch services and dentists
  useEffect(() => {
    if (!clinic) return

    async function fetchData() {
      try {
        const [servicesRes, dentistsRes] = await Promise.all([
          fetch(`${API_URL}/booking/${params.slug}/services`),
          fetch(`${API_URL}/booking/${params.slug}/dentists`),
        ])
        const servicesData = await servicesRes.json()
        const dentistsData = await dentistsRes.json()
        setServices(servicesData.data || servicesData)
        setDentists(dentistsData.data || dentistsData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [clinic, params.slug])

  // Fetch available slots when date or dentist changes
  useEffect(() => {
    if (!selectedDate || !selectedService) return

    async function fetchSlots() {
      try {
        const url = new URL(`${API_URL}/booking/${params.slug}/available-slots`)
        url.searchParams.set("date", selectedDate!)
        url.searchParams.set("serviceId", selectedService!.id)
        if (selectedDentist) {
          url.searchParams.set("dentistId", selectedDentist.id)
        }

        const res = await fetch(url.toString())
        const data = await res.json()
        setAvailableSlots(data.data?.available_slots || data.available_slots || [])
      } catch (err) {
        console.error("Error fetching slots:", err)
        setAvailableSlots([])
      }
    }
    fetchSlots()
  }, [selectedDate, selectedService, selectedDentist, params.slug])

  // Apply clinic branding
  useEffect(() => {
    if (clinic?.primary_color) {
      document.documentElement.style.setProperty("--primary", clinic.primary_color)
    }
    if (clinic?.favicon_url) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
      if (link) link.href = clinic.favicon_url
    }
  }, [clinic])

  const goToStep = (step: Step) => {
    setCurrentStep(step)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const goBack = () => {
    const currentIndex = STEPS.indexOf(currentStep)
    if (currentIndex > 0) {
      goToStep(STEPS[currentIndex - 1])
    }
  }

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    goToStep("dentist")
  }

  const handleDentistSelect = (dentist: Dentist | null) => {
    setSelectedDentist(dentist)
    goToStep("datetime")
  }

  const handleDateTimeSelect = (date: string, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
    goToStep("patient")
  }

  const handlePatientSubmit = (data: PatientData, notesValue: string) => {
    setPatientData(data)
    setNotes(notesValue)
    goToStep("confirm")
  }

  const handleConfirm = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !patientData) return

    setSubmitting(true)
    try {
      const res = await fetch(`${API_URL}/booking/${params.slug}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: selectedService.id,
          dentist_id: selectedDentist?.id,
          date: selectedDate,
          time: selectedTime,
          patient: patientData,
          notes: notes || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Erro ao confirmar agendamento")
      }

      const data = await res.json()
      setBookingResult(data.data || data)
      goToStep("success")
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading && !error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Ops!</h1>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
        <Button onClick={() => router.push("/")}>Voltar ao início</Button>
      </div>
    )
  }

  const stepIndex = STEPS.indexOf(currentStep)
  const progressPercent = currentStep === "success" ? 100 : ((stepIndex + 1) / STEPS.length) * 100

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            {clinic?.logo_url ? (
              <Image
                src={clinic.logo_url}
                alt={clinic.name}
                width={40}
                height={40}
                className="h-10 w-auto rounded-lg object-contain"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-white">
                {clinic?.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="font-semibold text-gray-900">{clinic?.name}</h1>
              {clinic?.slogan && <p className="text-xs text-gray-500">{clinic.slogan}</p>}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {currentStep !== "success" && (
          <div className="h-1 bg-gray-100">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        {currentStep !== "success" && currentStep !== "service" && (
          <Button variant="ghost" onClick={goBack} className="mb-6 -ml-2 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        )}

        {currentStep === "service" && (
          <ServiceSelector services={services} onSelect={handleServiceSelect} />
        )}

        {currentStep === "dentist" && (
          <DentistSelector dentists={dentists} onSelect={handleDentistSelect} />
        )}

        {currentStep === "datetime" && (
          <DateTimePicker
            slots={availableSlots}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateChange={(date) => {
              setSelectedDate(date)
              setSelectedTime(null)
            }}
            onTimeSelect={(time) => {
              setSelectedTime(time)
              if (selectedDate) {
                handleDateTimeSelect(selectedDate, time)
              }
            }}
          />
        )}

        {currentStep === "patient" && (
          <PatientForm onSubmit={handlePatientSubmit} initialNotes={notes} />
        )}

        {currentStep === "confirm" && (
          <BookingSummary
            clinic={clinic!}
            service={selectedService!}
            dentist={selectedDentist}
            date={selectedDate!}
            time={selectedTime!}
            patient={patientData!}
            notes={notes}
            onConfirm={handleConfirm}
            submitting={submitting}
          />
        )}

        {currentStep === "success" && bookingResult && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-800">Agendamento Confirmado!</h2>
                <p className="mt-2 text-green-700">
                  Seu agendamento foi realizado com sucesso.
                </p>
              </div>

              <div className="w-full max-w-md space-y-3 rounded-lg bg-white p-6 text-left shadow-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Serviço</span>
                  <span className="font-medium">{bookingResult.service_name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Data</span>
                  <span className="font-medium">
                    {new Date(bookingResult.date + "T12:00:00").toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Horário</span>
                  <span className="font-medium">{bookingResult.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dentista</span>
                  <span className="font-medium">{bookingResult.dentist_name}</span>
                </div>
              </div>

              {clinic?.phone && (
                <p className="text-sm text-gray-600">
                  Dúvidas? Entre em contato:{" "}
                  <a href={`tel:${clinic.phone}`} className="font-medium text-primary underline">
                    {clinic.phone}
                  </a>
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
