"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Loader2, Building2, User, Briefcase, Clock, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useClinic } from "@/hooks/useClinic"
import { useTranslations } from "next-intl"

interface DentistForm {
  name: string
  cro: string
  specialty: string
  phone: string
  email: string
}

interface ServiceForm {
  name: string
  price: string
  duration: string
  selected: boolean
}

interface ScheduleDay {
  enabled: boolean
  start: string
  end: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const { clinic, refreshClinic } = useClinic()
  const t = useTranslations("onboarding")
  const tc = useTranslations("common")
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const STEPS = [
    { key: "clinic", label: t("clinic"), icon: Building2 },
    { key: "dentist", label: t("dentist"), icon: User },
    { key: "services", label: t("services"), icon: Briefcase },
    { key: "schedule", label: t("schedule"), icon: Clock },
    { key: "done", label: t("done"), icon: CheckCircle2 },
  ]

  const DAYS = [
    { key: "monday", label: t("monday") },
    { key: "tuesday", label: t("tuesday") },
    { key: "wednesday", label: t("wednesday") },
    { key: "thursday", label: t("thursday") },
    { key: "friday", label: t("friday") },
    { key: "saturday", label: t("saturday") },
  ]

  const COMMON_SERVICES = [
    { name: t("consultation"), price: "150", duration: "30" },
    { name: t("cleaning"), price: "200", duration: "45" },
    { name: t("restoration"), price: "250", duration: "60" },
    { name: t("extraction"), price: "300", duration: "45" },
    { name: t("rootCanal"), price: "800", duration: "90" },
    { name: t("whitening"), price: "600", duration: "60" },
  ]

  // Clinic info
  const [clinicForm, setClinicForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    cep: "",
  })

  // Dentist
  const [dentist, setDentist] = useState<DentistForm>({
    name: "",
    cro: "",
    specialty: "",
    phone: "",
    email: "",
  })

  // Services
  const [services, setServices] = useState<ServiceForm[]>(
    COMMON_SERVICES.map((s) => ({ ...s, selected: false }))
  )
  const [customService, setCustomService] = useState({ name: "", price: "", duration: "30" })

  // Schedule
  const [schedule, setSchedule] = useState<Record<string, ScheduleDay>>(
    Object.fromEntries(DAYS.map((d) => [d.key, { enabled: d.key !== "saturday", start: "08:00", end: "18:00" }]))
  )

  useEffect(() => {
    if (clinic) {
      setClinicForm({
        name: clinic.name || "",
        phone: clinic.phone || "",
        address: clinic.address || "",
        city: clinic.city || "",
        state: clinic.state || "",
        cep: clinic.cep || "",
      })
    }
  }, [clinic])

  function getErrorMessage(error: any, fallback: string): string {
    const msg = error?.response?.data?.message
    if (Array.isArray(msg)) return msg.join(". ")
    if (typeof msg === "string") return msg
    return fallback
  }

  async function handleClinicSave() {
    if (!clinicForm.name || !clinicForm.phone) {
      toast.error(t("fillClinicNamePhone"))
      return
    }
    setLoading(true)
    try {
      await api.put("/clinics/my/profile", clinicForm)
      setStep(1)
    } catch (error: any) {
      toast.error(getErrorMessage(error, t("errorSavingClinic")))
    } finally {
      setLoading(false)
    }
  }

  async function handleDentistSave() {
    if (!dentist.name || !dentist.cro) {
      toast.error(t("fillDentistNameCro"))
      return
    }
    setLoading(true)
    try {
      await api.post("/dentists", dentist)
      setStep(2)
    } catch (error: any) {
      if (error?.response?.status === 409) {
        toast.info(t("dentistAlreadyRegistered"))
        setStep(2)
      } else {
        toast.error(getErrorMessage(error, t("errorRegisteringDentist")))
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleServicesSave() {
    const selected = services.filter((s) => s.selected)
    if (selected.length === 0 && !customService.name) {
      toast.error(t("selectAtLeastOneService"))
      return
    }
    setLoading(true)
    try {
      const toCreate = [...selected]
      if (customService.name) {
        toCreate.push({ ...customService, selected: true })
      }
      let created = 0
      let skipped = 0
      for (const s of toCreate) {
        try {
          await api.post("/services", {
            name: s.name,
            price: parseFloat(s.price) || 0,
            duration: parseInt(s.duration) || 30,
          })
          created++
        } catch (err: any) {
          if (err?.response?.status === 409) {
            skipped++
          } else {
            throw err
          }
        }
      }
      if (skipped > 0 && created === 0) {
        toast.info(t("servicesAlreadyRegistered"))
      }
      setStep(3)
    } catch (error: any) {
      toast.error(getErrorMessage(error, t("errorRegisteringServices")))
    } finally {
      setLoading(false)
    }
  }

  async function handleScheduleSave() {
    setLoading(true)
    try {
      const businessHours: Record<string, { start: string; end: string } | null> = {}
      for (const [day, config] of Object.entries(schedule)) {
        businessHours[day] = config.enabled ? { start: config.start, end: config.end } : null
      }
      await api.put("/clinics/my/profile", {
        business_hours: businessHours,
        onboarding_completed: true,
      })
      await refreshClinic()
      setStep(4)
    } catch (error: any) {
      toast.error(getErrorMessage(error, t("errorSavingSchedule")))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="border-b bg-card">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold">{t("initialSetup")}</h1>
            <span className="text-sm text-muted-foreground">{t("stepOf", { current: Math.min(step + 1, 5), total: 5 })}</span>
          </div>
          <div className="flex gap-2">
            {STEPS.map((s, i) => (
              <div
                key={s.key}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  i <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={s.key} className={`flex items-center gap-1 text-xs ${i <= step ? "text-primary font-medium" : "text-muted-foreground"}`}>
                  <Icon className="h-3 w-3" />
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        {/* Step 0: Clinic info */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">{t("clinicData")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("fillBasicInfo")}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">{t("clinicName")}</label>
                <input
                  value={clinicForm.name}
                  onChange={(e) => setClinicForm({ ...clinicForm, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder={t("clinicNamePlaceholder")}
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t("phone")}</label>
                <input
                  value={clinicForm.phone}
                  onChange={(e) => setClinicForm({ ...clinicForm, phone: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder={t("phonePlaceholder")}
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t("zipCode")}</label>
                <input
                  value={clinicForm.cep}
                  onChange={(e) => setClinicForm({ ...clinicForm, cep: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder={t("zipCodePlaceholder")}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">{t("address")}</label>
                <input
                  value={clinicForm.address}
                  onChange={(e) => setClinicForm({ ...clinicForm, address: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder={t("addressPlaceholder")}
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t("city")}</label>
                <input
                  value={clinicForm.city}
                  onChange={(e) => setClinicForm({ ...clinicForm, city: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t("state")}</label>
                <input
                  value={clinicForm.state}
                  onChange={(e) => setClinicForm({ ...clinicForm, state: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder={t("statePlaceholder")}
                  maxLength={2}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleClinicSave} disabled={loading} className="gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                {tc("next")}
              </Button>
            </div>
          </div>
        )}

        {/* Step 1: Dentist */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">{t("registerFirstDentist")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("canAddMoreLater")}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">{t("fullName")}</label>
                <input
                  value={dentist.name}
                  onChange={(e) => setDentist({ ...dentist, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder={t("fullNamePlaceholder")}
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t("cro")}</label>
                <input
                  value={dentist.cro}
                  onChange={(e) => setDentist({ ...dentist, cro: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder={t("croPlaceholder")}
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t("specialty")}</label>
                <input
                  value={dentist.specialty}
                  onChange={(e) => setDentist({ ...dentist, specialty: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder={t("specialtyPlaceholder")}
                />
              </div>
              <div>
                <label className="text-sm font-medium">{tc("phone")}</label>
                <input
                  value={dentist.phone}
                  onChange={(e) => setDentist({ ...dentist, phone: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t("email")}</label>
                <input
                  value={dentist.email}
                  onChange={(e) => setDentist({ ...dentist, email: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(0)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> {tc("back")}
              </Button>
              <Button onClick={handleDentistSave} disabled={loading} className="gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                {tc("next")}
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Services */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">{t("selectServices")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("selectServicesDesc")}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {services.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const updated = [...services]
                    updated[i].selected = !updated[i].selected
                    setServices(updated)
                  }}
                  className={`p-4 border rounded-xl text-left transition-all ${
                    s.selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-accent"
                  }`}
                >
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">R$ {s.price} - {s.duration} min</p>
                </button>
              ))}
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">{t("addCustomService")}</p>
              <div className="flex gap-2">
                <input
                  value={customService.name}
                  onChange={(e) => setCustomService({ ...customService, name: e.target.value })}
                  placeholder={t("serviceNamePlaceholder")}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <input
                  value={customService.price}
                  onChange={(e) => setCustomService({ ...customService, price: e.target.value })}
                  placeholder={t("pricePlaceholder")}
                  type="number"
                  className="w-24 px-3 py-2 border rounded-lg text-sm"
                />
                <input
                  value={customService.duration}
                  onChange={(e) => setCustomService({ ...customService, duration: e.target.value })}
                  placeholder={t("minPlaceholder")}
                  type="number"
                  className="w-20 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> {tc("back")}
              </Button>
              <Button onClick={handleServicesSave} disabled={loading} className="gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                {tc("next")}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Schedule */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">{t("businessHours")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("businessHoursDesc")}</p>
            </div>
            <div className="space-y-3">
              {DAYS.map((d) => {
                const daySchedule = schedule[d.key]
                return (
                  <div key={d.key} className="flex items-center gap-4 p-3 border rounded-lg">
                    <label className="flex items-center gap-2 w-28">
                      <input
                        type="checkbox"
                        checked={daySchedule.enabled}
                        onChange={(e) => setSchedule({ ...schedule, [d.key]: { ...daySchedule, enabled: e.target.checked } })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">{d.label}</span>
                    </label>
                    {daySchedule.enabled && (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={daySchedule.start}
                          onChange={(e) => setSchedule({ ...schedule, [d.key]: { ...daySchedule, start: e.target.value } })}
                          className="px-2 py-1 border rounded text-sm"
                        />
                        <span className="text-muted-foreground text-sm">{t("until")}</span>
                        <input
                          type="time"
                          value={daySchedule.end}
                          onChange={(e) => setSchedule({ ...schedule, [d.key]: { ...daySchedule, end: e.target.value } })}
                          className="px-2 py-1 border rounded text-sm"
                        />
                      </div>
                    )}
                    {!daySchedule.enabled && (
                      <span className="text-sm text-muted-foreground">{t("closed")}</span>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> {tc("back")}
              </Button>
              <Button onClick={handleScheduleSave} disabled={loading} className="gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {t("finish")}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Done */}
        {step === 4 && (
          <div className="text-center py-12 space-y-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{t("allDone")}</h2>
              <p className="text-muted-foreground mt-2">
                {t("clinicReady")}
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => router.push("/patients")}>
                {t("registerPatients")}
              </Button>
              <Button onClick={() => router.push("/home")} className="gap-2">
                {t("goToDashboard")} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
