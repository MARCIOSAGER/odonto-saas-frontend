"use client"
import { useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  notes: string
}

interface Props {
  patientId: string
  dentistId: string
  onCreated?: (prescription: Record<string, unknown>) => void
}

export function PrescriptionForm({ patientId, dentistId, onCreated }: Props) {
  const t = useTranslations("prescription")
  const [type, setType] = useState<string>("prescription")
  const [medications, setMedications] = useState<Medication[]>([
    { name: "", dosage: "", frequency: "", duration: "", notes: "" },
  ])
  const [text, setText] = useState("")
  const [saving, setSaving] = useState(false)

  const PRESCRIPTION_TYPES = [
    { value: "prescription", label: t("typePrescription") },
    { value: "certificate", label: t("typeCertificate") },
    { value: "referral", label: t("typeReferral") },
  ]

  function addMedication() {
    setMedications((prev) => [
      ...prev,
      { name: "", dosage: "", frequency: "", duration: "", notes: "" },
    ])
  }

  function removeMedication(index: number) {
    setMedications((prev) => prev.filter((_, i) => i !== index))
  }

  function updateMedication(index: number, field: keyof Medication, value: string) {
    setMedications((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    )
  }

  async function handleSubmit() {
    if (type === "prescription") {
      const validMeds = medications.filter((m) => m.name.trim())
      if (validMeds.length === 0) {
        toast.error(t("addMedication"))
        return
      }
    } else {
      if (!text.trim()) {
        toast.error(t("fillContent"))
        return
      }
    }

    setSaving(true)
    try {
      const content =
        type === "prescription"
          ? { medications: medications.filter((m) => m.name.trim()) }
          : { text: text.trim() }

      const res = await api.post("/prescriptions", {
        patient_id: patientId,
        dentist_id: dentistId,
        type,
        content,
      })

      toast.success(
        type === "prescription"
          ? t("prescriptionCreated")
          : type === "certificate"
            ? t("certificateCreated")
            : t("referralCreated")
      )
      onCreated?.(res.data)

      // Reset form
      setMedications([{ name: "", dosage: "", frequency: "", duration: "", notes: "" }])
      setText("")
    } catch {
      toast.error(t("createError"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Type selector */}
      <div className="flex gap-2">
        {PRESCRIPTION_TYPES.map((pt) => (
          <button
            key={pt.value}
            onClick={() => setType(pt.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === pt.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {pt.label}
          </button>
        ))}
      </div>

      {/* Prescription form (medications) */}
      {type === "prescription" && (
        <div className="space-y-3">
          {medications.map((med, i) => (
            <div key={i} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  {t("medicationNumber", { number: i + 1 })}
                </span>
                {medications.length > 1 && (
                  <button
                    onClick={() => removeMedication(i)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  placeholder={t("medicationName")}
                  value={med.name}
                  onChange={(e) => updateMedication(i, "name", e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input
                  placeholder={t("dosage")}
                  value={med.dosage}
                  onChange={(e) => updateMedication(i, "dosage", e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input
                  placeholder={t("frequency")}
                  value={med.frequency}
                  onChange={(e) => updateMedication(i, "frequency", e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input
                  placeholder={t("duration")}
                  value={med.duration}
                  onChange={(e) => updateMedication(i, "duration", e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <input
                placeholder={t("notesOptional")}
                value={med.notes}
                onChange={(e) => updateMedication(i, "notes", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          ))}

          <Button variant="outline" size="sm" onClick={addMedication} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("addMedicationBtn")}
          </Button>
        </div>
      )}

      {/* Certificate / Referral form (free text) */}
      {(type === "certificate" || type === "referral") && (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            type === "certificate"
              ? t("certificatePlaceholder")
              : t("referralPlaceholder")
          }
          rows={6}
          className="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      )}

      <Button onClick={handleSubmit} disabled={saving} className="gap-2">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        {type === "prescription" ? t("createPrescription") : type === "certificate" ? t("createCertificate") : t("createReferral")}
      </Button>
    </div>
  )
}
