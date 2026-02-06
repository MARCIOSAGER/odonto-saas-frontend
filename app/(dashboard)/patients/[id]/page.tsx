"use client"
import { useParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { api } from "@/lib/api"
import { Loader2, Phone, Mail, Calendar, User, FileText, Sparkles, ClipboardList, Pill, DollarSign, History, Smile } from "lucide-react"
import { PatientSummaryCard } from "@/components/ai/patient-summary-card"
import { useDentists } from "@/hooks/useDentists"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"

function TabSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/3" />
      <div className="h-64 bg-muted rounded" />
    </div>
  )
}

const OdontogramViewer = dynamic(
  () => import("@/components/odontogram/odontogram-viewer").then(m => ({ default: m.OdontogramViewer })),
  { ssr: false, loading: () => <TabSkeleton /> }
)
const ClinicalNotesGenerator = dynamic(
  () => import("@/components/ai/clinical-notes-generator").then(m => ({ default: m.ClinicalNotesGenerator })),
  { ssr: false, loading: () => <TabSkeleton /> }
)
const TreatmentPlanAi = dynamic(
  () => import("@/components/ai/treatment-plan-ai").then(m => ({ default: m.TreatmentPlanAi })),
  { ssr: false, loading: () => <TabSkeleton /> }
)
const PrescriptionForm = dynamic(
  () => import("@/components/prescriptions/prescription-form").then(m => ({ default: m.PrescriptionForm })),
  { ssr: false, loading: () => <TabSkeleton /> }
)
const PrescriptionList = dynamic(
  () => import("@/components/prescriptions/prescription-list").then(m => ({ default: m.PrescriptionList })),
  { ssr: false, loading: () => <TabSkeleton /> }
)
const AnamnesisForm = dynamic(
  () => import("@/components/ai/anamnesis-form").then(m => ({ default: m.AnamnesisForm })),
  { ssr: false, loading: () => <TabSkeleton /> }
)
const PatientFinancial = dynamic(
  () => import("@/components/patients/patient-financial").then(m => ({ default: m.PatientFinancial })),
  { ssr: false, loading: () => <TabSkeleton /> }
)
const PatientTimeline = dynamic(
  () => import("@/components/patients/patient-timeline").then(m => ({ default: m.PatientTimeline })),
  { ssr: false, loading: () => <TabSkeleton /> }
)
const PatientHofTab = dynamic(
  () => import("@/components/patients/patient-hof-tab").then(m => ({ default: m.PatientHofTab })),
  { ssr: false, loading: () => <TabSkeleton /> }
)

interface Patient {
  id: string
  name: string
  phone: string
  cpf: string | null
  email: string | null
  birth_date: string | null
  address: string | null
  notes: string | null
  status: string
  last_visit: string | null
  created_at: string
}

type TabKey = "resumo" | "odontograma" | "prontuario" | "tratamento" | "receitas" | "anamnese" | "hof" | "financeiro" | "historico"

export default function PatientDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabKey>("resumo")
  const [selectedDentistId, setSelectedDentistId] = useState<string>("")
  const [prescriptionKey, setPrescriptionKey] = useState(0)
  const { dentists } = useDentists()
  const t = useTranslations("patientDetail")
  const locale = useLocale()

  const loadPatient = useCallback(async () => {
    try {
      const res = await api.get(`/patients/${id}`)
      setPatient(res.data?.data || res.data)
    } catch {
      // handle error
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) loadPatient()
  }, [id, loadPatient])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        {t("patientNotFound")}
      </div>
    )
  }

  const age = patient.birth_date
    ? Math.floor(
        (Date.now() - new Date(patient.birth_date).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    : null

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: "resumo", label: t("tabSummary"), icon: User },
    { key: "odontograma", label: t("tabOdontogram"), icon: FileText },
    { key: "prontuario", label: t("tabClinicalNotes"), icon: Sparkles },
    { key: "tratamento", label: t("tabTreatmentPlan"), icon: Calendar },
    { key: "receitas", label: t("tabPrescriptions"), icon: Pill },
    { key: "anamnese", label: t("tabAnamnesis"), icon: ClipboardList },
    { key: "hof", label: t("tabHof"), icon: Smile },
    { key: "financeiro", label: t("tabFinancial"), icon: DollarSign },
    { key: "historico", label: t("tabTimeline"), icon: History },
  ]

  return (
    <div className="space-y-6">
      {/* Patient header */}
      <div className="border rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{patient.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
              {patient.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {patient.phone}
                </span>
              )}
              {patient.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {patient.email}
                </span>
              )}
              {age !== null && (
                <span>{t("yearsOld", { age })}</span>
              )}
              {patient.cpf && (
                <span>{t("fieldCpf")}: {patient.cpf}</span>
              )}
            </div>
          </div>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              patient.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {patient.status === "active" ? t("active") : patient.status === "inactive" ? t("inactive") : patient.status}
          </span>
        </div>

        {patient.notes && (
          <p className="text-sm text-muted-foreground mt-3 bg-muted/50 p-3 rounded-lg">
            {patient.notes}
          </p>
        )}

        <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
          {patient.last_visit && (
            <span>{t("lastVisit")}: {new Date(patient.last_visit).toLocaleDateString(locale)}</span>
          )}
          <span>{t("registeredAt")}: {new Date(patient.created_at).toLocaleDateString(locale)}</span>
        </div>
      </div>

      {/* AI Summary Card */}
      <PatientSummaryCard patientId={id} />

      {/* Tabs */}
      <div className="border-b overflow-x-auto">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "resumo" && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">{t("patientInfo")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">{t("fieldName")}:</span>{" "}
                  {patient.name}
                </div>
                <div>
                  <span className="text-muted-foreground">{t("fieldPhone")}:</span>{" "}
                  {patient.phone}
                </div>
                {patient.email && (
                  <div>
                    <span className="text-muted-foreground">{t("fieldEmail")}:</span>{" "}
                    {patient.email}
                  </div>
                )}
                {patient.cpf && (
                  <div>
                    <span className="text-muted-foreground">{t("fieldCpf")}:</span>{" "}
                    {patient.cpf}
                  </div>
                )}
                {patient.birth_date && (
                  <div>
                    <span className="text-muted-foreground">{t("fieldBirthDate")}:</span>{" "}
                    {new Date(patient.birth_date).toLocaleDateString(locale)}
                  </div>
                )}
                {patient.address && (
                  <div className="sm:col-span-2">
                    <span className="text-muted-foreground">{t("fieldAddress")}:</span>{" "}
                    {patient.address}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "odontograma" && (
          <OdontogramViewer patientId={id} />
        )}

        {activeTab === "prontuario" && (
          <ClinicalNotesGenerator patientId={id} />
        )}

        {activeTab === "tratamento" && (
          <TreatmentPlanAi patientId={id} />
        )}

        {activeTab === "receitas" && (
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">{t("newPrescription")}</h3>
              <div className="mb-4">
                <label className="text-sm font-medium block mb-1">{t("dentist")}</label>
                <select
                  value={selectedDentistId}
                  onChange={(e) => setSelectedDentistId(e.target.value)}
                  className="w-full max-w-xs px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">{t("selectDentist")}</option>
                  {dentists.map((d: { id: string; name: string; cro: string }) => (
                    <option key={d.id} value={d.id}>
                      Dr(a). {d.name} - CRO {d.cro}
                    </option>
                  ))}
                </select>
              </div>
              {selectedDentistId ? (
                <PrescriptionForm
                  patientId={id}
                  dentistId={selectedDentistId}
                  onCreated={() => setPrescriptionKey((k) => k + 1)}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("selectDentistHint")}
                </p>
              )}
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">{t("previousDocuments")}</h3>
              <PrescriptionList key={prescriptionKey} patientId={id} />
            </div>
          </div>
        )}

        {activeTab === "anamnese" && (
          <AnamnesisForm patientId={id} />
        )}

        {activeTab === "hof" && (
          <PatientHofTab patientId={id} />
        )}

        {activeTab === "financeiro" && (
          <PatientFinancial patientId={id} />
        )}

        {activeTab === "historico" && (
          <PatientTimeline patientId={id} />
        )}
      </div>
    </div>
  )
}
