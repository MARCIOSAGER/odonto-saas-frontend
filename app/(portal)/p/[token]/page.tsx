"use client"
import { useParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { Loader2, Calendar, FileText, Phone, MapPin } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

interface PortalData {
  id: string
  name: string
  phone: string
  email: string | null
  clinic: {
    name: string
    phone: string
    address: string | null
    city: string | null
    state: string | null
    logo_url: string | null
  }
}

interface Appointment {
  id: string
  date: string
  time: string
  status: string
  service: { name: string; duration: number }
  dentist: { name: string; specialty: string | null } | null
}

interface Prescription {
  id: string
  type: string
  content: Record<string, unknown>
  created_at: string
  dentist: { name: string; cro: string }
}

type TabKey = "consultas" | "documentos"

export default function PatientPortalPage() {
  const params = useParams()
  const token = params?.token as string
  const [portal, setPortal] = useState<PortalData | null>(null)
  const [appointments, setAppointments] = useState<{ upcoming: Appointment[]; recent: Appointment[] }>({ upcoming: [], recent: [] })
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>("consultas")

  const loadData = useCallback(async () => {
    try {
      const [portalRes, aptsRes, presRes] = await Promise.all([
        fetch(`${API_URL}/portal/${token}`).then((r) => r.ok ? r.json() : Promise.reject()),
        fetch(`${API_URL}/portal/${token}/appointments`).then((r) => r.ok ? r.json() : null),
        fetch(`${API_URL}/portal/${token}/prescriptions`).then((r) => r.ok ? r.json() : null),
      ])
      setPortal(portalRes)
      if (aptsRes) setAppointments(aptsRes)
      if (presRes) setPrescriptions(Array.isArray(presRes) ? presRes : [])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) loadData()
  }, [token, loadData])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
      </div>
    )
  }

  if (error || !portal) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center space-y-3">
          <h1 className="text-xl font-bold">Link inválido</h1>
          <p className="text-gray-500">Este link de acesso não é válido ou expirou.</p>
        </div>
      </div>
    )
  }

  const STATUS_LABELS: Record<string, string> = {
    scheduled: "Agendada",
    confirmed: "Confirmada",
    completed: "Realizada",
    cancelled: "Cancelada",
    no_show: "Faltou",
  }

  const STATUS_COLORS: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-800",
    confirmed: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
    no_show: "bg-amber-100 text-amber-800",
  }

  const TYPE_LABELS: Record<string, string> = {
    prescription: "Receituário",
    certificate: "Atestado",
    referral: "Encaminhamento",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-lg font-bold text-sky-700">{portal.clinic.name}</h1>
          <p className="text-sm text-gray-500">Portal do Paciente</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Patient info */}
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h2 className="text-xl font-bold">{portal.name}</h2>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
            {portal.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" /> {portal.phone}
              </span>
            )}
            {portal.clinic.address && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {portal.clinic.address}
                {portal.clinic.city && `, ${portal.clinic.city}`}
                {portal.clinic.state && ` - ${portal.clinic.state}`}
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm border">
          <button
            onClick={() => setActiveTab("consultas")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "consultas" ? "bg-sky-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Calendar className="h-4 w-4" /> Consultas
          </button>
          <button
            onClick={() => setActiveTab("documentos")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "documentos" ? "bg-sky-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FileText className="h-4 w-4" /> Documentos
          </button>
        </div>

        {/* Consultas tab */}
        {activeTab === "consultas" && (
          <div className="space-y-4">
            {/* Upcoming */}
            {appointments.upcoming.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2 text-gray-700">Próximas consultas</h3>
                <div className="space-y-2">
                  {appointments.upcoming.map((apt) => (
                    <div key={apt.id} className="bg-white rounded-lg p-4 shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{apt.service.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(apt.date).toLocaleDateString("pt-BR")} às {apt.time}
                            {apt.dentist && ` - Dr(a). ${apt.dentist.name}`}
                          </p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[apt.status] || "bg-gray-100"}`}>
                          {STATUS_LABELS[apt.status] || apt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent */}
            {appointments.recent.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2 text-gray-700">Histórico recente</h3>
                <div className="space-y-2">
                  {appointments.recent.map((apt) => (
                    <div key={apt.id} className="bg-white rounded-lg p-3 shadow-sm border">
                      <div className="flex items-center justify-between text-sm">
                        <span>{apt.service.name}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(apt.date).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {appointments.upcoming.length === 0 && appointments.recent.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                Nenhuma consulta encontrada
              </div>
            )}
          </div>
        )}

        {/* Documentos tab */}
        {activeTab === "documentos" && (
          <div className="space-y-2">
            {prescriptions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                Nenhum documento encontrado
              </div>
            ) : (
              prescriptions.map((p) => {
                const content = p.content as Record<string, unknown>
                const medications = content?.medications as Record<string, string>[] | undefined
                const text = content?.text as string | undefined

                return (
                  <div key={p.id} className="bg-white rounded-lg p-4 shadow-sm border space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-sky-600" />
                        <span className="font-medium text-sm">{TYPE_LABELS[p.type] || p.type}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(p.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Dr(a). {p.dentist.name} - CRO {p.dentist.cro}</p>

                    {medications && medications.length > 0 && (
                      <div className="bg-gray-50 rounded p-2 text-sm space-y-1">
                        {medications.map((m, i) => (
                          <div key={i}>
                            <span className="font-medium">{m.name}</span>
                            {m.dosage && <span className="text-gray-500"> {m.dosage}</span>}
                            {m.frequency && <span className="text-gray-500">, {m.frequency}</span>}
                            {m.duration && <span className="text-gray-500">, {m.duration}</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {text && <p className="text-sm bg-gray-50 rounded p-2">{text}</p>}
                  </div>
                )
              })
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t bg-white">
        <div className="max-w-2xl mx-auto px-4 py-4 text-center text-xs text-gray-400">
          Portal do Paciente - {portal.clinic.name}
          {portal.clinic.phone && (
            <span className="block mt-1">Contato: {portal.clinic.phone}</span>
          )}
        </div>
      </footer>
    </div>
  )
}
