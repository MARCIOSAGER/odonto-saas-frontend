"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Loader2, Building2, User, Briefcase, Clock, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useClinic } from "@/hooks/useClinic"

const STEPS = [
  { key: "clinic", label: "Cl\u00ednica", icon: Building2 },
  { key: "dentist", label: "Dentista", icon: User },
  { key: "services", label: "Servi\u00e7os", icon: Briefcase },
  { key: "schedule", label: "Hor\u00e1rios", icon: Clock },
  { key: "done", label: "Pronto!", icon: CheckCircle2 },
]

const DAYS = [
  { key: "monday", label: "Segunda" },
  { key: "tuesday", label: "Ter\u00e7a" },
  { key: "wednesday", label: "Quarta" },
  { key: "thursday", label: "Quinta" },
  { key: "friday", label: "Sexta" },
  { key: "saturday", label: "S\u00e1bado" },
]

const COMMON_SERVICES = [
  { name: "Consulta", price: "150", duration: "30" },
  { name: "Limpeza", price: "200", duration: "45" },
  { name: "Restaura\u00e7\u00e3o", price: "250", duration: "60" },
  { name: "Extra\u00e7\u00e3o", price: "300", duration: "45" },
  { name: "Canal", price: "800", duration: "90" },
  { name: "Clareamento", price: "600", duration: "60" },
]

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
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

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

  async function handleClinicSave() {
    if (!clinicForm.name || !clinicForm.phone) {
      toast.error("Preencha nome e telefone da cl\u00ednica")
      return
    }
    setLoading(true)
    try {
      await api.put("/clinics/my/profile", clinicForm)
      setStep(1)
    } catch {
      toast.error("Erro ao salvar dados da cl\u00ednica")
    } finally {
      setLoading(false)
    }
  }

  async function handleDentistSave() {
    if (!dentist.name || !dentist.cro) {
      toast.error("Preencha nome e CRO do dentista")
      return
    }
    setLoading(true)
    try {
      await api.post("/dentists", dentist)
      setStep(2)
    } catch {
      toast.error("Erro ao cadastrar dentista")
    } finally {
      setLoading(false)
    }
  }

  async function handleServicesSave() {
    const selected = services.filter((s) => s.selected)
    if (selected.length === 0 && !customService.name) {
      toast.error("Selecione ou adicione pelo menos um servi\u00e7o")
      return
    }
    setLoading(true)
    try {
      const toCreate = [...selected]
      if (customService.name) {
        toCreate.push({ ...customService, selected: true })
      }
      for (const s of toCreate) {
        await api.post("/services", {
          name: s.name,
          price: parseFloat(s.price) || 0,
          duration: parseInt(s.duration) || 30,
        })
      }
      setStep(3)
    } catch {
      toast.error("Erro ao cadastrar servi\u00e7os")
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
    } catch {
      toast.error("Erro ao salvar hor\u00e1rios")
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
            <h1 className="text-lg font-bold">Configura&ccedil;&atilde;o inicial</h1>
            <span className="text-sm text-muted-foreground">Passo {Math.min(step + 1, 5)} de 5</span>
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
              <h2 className="text-xl font-bold">Dados da cl&iacute;nica</h2>
              <p className="text-sm text-muted-foreground mt-1">Preencha as informa&ccedil;&otilde;es b&aacute;sicas</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Nome da cl&iacute;nica *</label>
                <input
                  value={clinicForm.name}
                  onChange={(e) => setClinicForm({ ...clinicForm, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Ex: Cl&iacute;nica Odonto Smile"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Telefone *</label>
                <input
                  value={clinicForm.phone}
                  onChange={(e) => setClinicForm({ ...clinicForm, phone: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <label className="text-sm font-medium">CEP</label>
                <input
                  value={clinicForm.cep}
                  onChange={(e) => setClinicForm({ ...clinicForm, cep: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="00000-000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Endere&ccedil;o</label>
                <input
                  value={clinicForm.address}
                  onChange={(e) => setClinicForm({ ...clinicForm, address: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Rua, n&uacute;mero, bairro"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Cidade</label>
                <input
                  value={clinicForm.city}
                  onChange={(e) => setClinicForm({ ...clinicForm, city: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Estado</label>
                <input
                  value={clinicForm.state}
                  onChange={(e) => setClinicForm({ ...clinicForm, state: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="SP"
                  maxLength={2}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleClinicSave} disabled={loading} className="gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                Pr&oacute;ximo
              </Button>
            </div>
          </div>
        )}

        {/* Step 1: Dentist */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Cadastre o primeiro dentista</h2>
              <p className="text-sm text-muted-foreground mt-1">Voc&ecirc; pode adicionar mais depois</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Nome completo *</label>
                <input
                  value={dentist.name}
                  onChange={(e) => setDentist({ ...dentist, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Dr(a). Nome Completo"
                />
              </div>
              <div>
                <label className="text-sm font-medium">CRO *</label>
                <input
                  value={dentist.cro}
                  onChange={(e) => setDentist({ ...dentist, cro: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="CRO-SP 12345"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Especialidade</label>
                <input
                  value={dentist.specialty}
                  onChange={(e) => setDentist({ ...dentist, specialty: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Ortodontia, Endodontia..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Telefone</label>
                <input
                  value={dentist.phone}
                  onChange={(e) => setDentist({ ...dentist, phone: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium">E-mail</label>
                <input
                  value={dentist.email}
                  onChange={(e) => setDentist({ ...dentist, email: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(0)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
              <Button onClick={handleDentistSave} disabled={loading} className="gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                Pr&oacute;ximo
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Services */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Selecione os servi&ccedil;os</h2>
              <p className="text-sm text-muted-foreground mt-1">Escolha os servi&ccedil;os que sua cl&iacute;nica oferece</p>
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
              <p className="text-sm font-medium mb-3">Adicionar servi&ccedil;o personalizado</p>
              <div className="flex gap-2">
                <input
                  value={customService.name}
                  onChange={(e) => setCustomService({ ...customService, name: e.target.value })}
                  placeholder="Nome do servi&ccedil;o"
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <input
                  value={customService.price}
                  onChange={(e) => setCustomService({ ...customService, price: e.target.value })}
                  placeholder="Pre&ccedil;o"
                  type="number"
                  className="w-24 px-3 py-2 border rounded-lg text-sm"
                />
                <input
                  value={customService.duration}
                  onChange={(e) => setCustomService({ ...customService, duration: e.target.value })}
                  placeholder="Min"
                  type="number"
                  className="w-20 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
              <Button onClick={handleServicesSave} disabled={loading} className="gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                Pr&oacute;ximo
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Schedule */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Hor&aacute;rio de funcionamento</h2>
              <p className="text-sm text-muted-foreground mt-1">Configure os dias e hor&aacute;rios da cl&iacute;nica</p>
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
                        <span className="text-muted-foreground text-sm">at&eacute;</span>
                        <input
                          type="time"
                          value={daySchedule.end}
                          onChange={(e) => setSchedule({ ...schedule, [d.key]: { ...daySchedule, end: e.target.value } })}
                          className="px-2 py-1 border rounded text-sm"
                        />
                      </div>
                    )}
                    {!daySchedule.enabled && (
                      <span className="text-sm text-muted-foreground">Fechado</span>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
              <Button onClick={handleScheduleSave} disabled={loading} className="gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Concluir
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
              <h2 className="text-2xl font-bold">Tudo pronto!</h2>
              <p className="text-muted-foreground mt-2">
                Sua cl&iacute;nica est&aacute; configurada e pronta para uso.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => router.push("/patients")}>
                Cadastrar pacientes
              </Button>
              <Button onClick={() => router.push("/home")} className="gap-2">
                Ir para o Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
