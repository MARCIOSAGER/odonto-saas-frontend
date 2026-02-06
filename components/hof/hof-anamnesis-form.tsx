"use client"
import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Save, CheckCircle2 } from "lucide-react"
import { useHofAnamnesis } from "@/hooks/useHof"

interface HofAnamnesisFormProps {
  patientId: string
}

const FITZPATRICK_TYPES = [
  { value: "I", label: "Tipo I - Pele muito clara, sempre queima" },
  { value: "II", label: "Tipo II - Pele clara, queima facilmente" },
  { value: "III", label: "Tipo III - Pele clara a morena, queima moderadamente" },
  { value: "IV", label: "Tipo IV - Pele morena, queima pouco" },
  { value: "V", label: "Tipo V - Pele morena escura, raramente queima" },
  { value: "VI", label: "Tipo VI - Pele negra, nunca queima" },
]

export function HofAnamnesisForm({ patientId }: HofAnamnesisFormProps) {
  const t = useTranslations("hof")
  const tc = useTranslations("common")

  const { anamnesis, isLoading, save, isSaving } = useHofAnamnesis(patientId)

  const [form, setForm] = useState({
    fitzpatrick_type: "",
    skin_conditions: "",
    previous_treatments: "",
    allergies: "",
    medications: "",
    expectations: "",
    contraindications: "",
    notes: "",
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (anamnesis) {
      setForm({
        fitzpatrick_type: anamnesis.fitzpatrick_type || "",
        skin_conditions: anamnesis.skin_conditions || "",
        previous_treatments: anamnesis.previous_treatments || "",
        allergies: anamnesis.allergies || "",
        medications: anamnesis.medications || "",
        expectations: anamnesis.expectations || "",
        contraindications: anamnesis.contraindications || "",
        notes: anamnesis.notes || "",
      })
    }
  }, [anamnesis])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await save(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      // Error handled by hook
    }
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("anamnesis.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Fitzpatrick Type */}
            <div className="space-y-2">
              <Label>{t("anamnesis.skinType")}</Label>
              <Select
                value={form.fitzpatrick_type}
                onValueChange={(v) => handleChange("fitzpatrick_type", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de pele" />
                </SelectTrigger>
                <SelectContent>
                  {FITZPATRICK_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Skin Conditions */}
            <div className="space-y-2">
              <Label>Condições de pele</Label>
              <Textarea
                value={form.skin_conditions}
                onChange={(e) => handleChange("skin_conditions", e.target.value)}
                placeholder="Acne, rosácea, melasma, cicatrizes..."
                rows={2}
              />
            </div>

            {/* Previous Treatments */}
            <div className="space-y-2">
              <Label>{t("anamnesis.previousTreatments")}</Label>
              <Textarea
                value={form.previous_treatments}
                onChange={(e) => handleChange("previous_treatments", e.target.value)}
                placeholder="Toxina botulínica, preenchimento, peeling..."
                rows={2}
              />
            </div>

            {/* Allergies */}
            <div className="space-y-2">
              <Label>{t("anamnesis.allergies")}</Label>
              <Textarea
                value={form.allergies}
                onChange={(e) => handleChange("allergies", e.target.value)}
                placeholder="Alergias conhecidas..."
                rows={2}
              />
            </div>

            {/* Medications */}
            <div className="space-y-2">
              <Label>{t("anamnesis.medications")}</Label>
              <Textarea
                value={form.medications}
                onChange={(e) => handleChange("medications", e.target.value)}
                placeholder="Medicamentos em uso..."
                rows={2}
              />
            </div>

            {/* Contraindications */}
            <div className="space-y-2">
              <Label>{t("anamnesis.contraindications")}</Label>
              <Textarea
                value={form.contraindications}
                onChange={(e) => handleChange("contraindications", e.target.value)}
                placeholder="Gestação, amamentação, doenças autoimunes..."
                rows={2}
              />
            </div>

            {/* Expectations */}
            <div className="space-y-2 md:col-span-2">
              <Label>{t("anamnesis.expectations")}</Label>
              <Textarea
                value={form.expectations}
                onChange={(e) => handleChange("expectations", e.target.value)}
                placeholder="O que o paciente espera dos procedimentos..."
                rows={3}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2 md:col-span-2">
              <Label>{t("anamnesis.notes")}</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Observações adicionais..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {tc("saving")}
                </>
              ) : saved ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Salvo
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {tc("save")}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
