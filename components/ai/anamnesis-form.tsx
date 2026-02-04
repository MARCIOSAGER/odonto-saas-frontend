"use client"
import { useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Sparkles, Loader2, AlertTriangle, Shield, Pill, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

const ANAMNESIS_KEYS = [
  "allergies",
  "medications",
  "diseases",
  "surgeries",
  "bleeding",
  "pregnant",
  "smoking",
  "dentalHistory",
  "bruxism",
  "breathing",
  "habits",
  "complaints",
] as const

interface AnamnesisResult {
  riskClassification?: string
  allergies?: string[]
  medications?: string[]
  conditions?: string[]
  contraindications?: string[]
  alerts?: string[]
  warnings?: string[]
  notes?: string
  recommendations?: string
  raw?: string
}

interface Props {
  patientId?: string
  onCompleted?: (result: AnamnesisResult) => void
}

const ASA_COLORS: Record<string, string> = {
  "ASA I": "bg-green-100 text-green-800",
  "ASA II": "bg-amber-100 text-amber-800",
  "ASA III": "bg-orange-100 text-orange-800",
  "ASA IV": "bg-red-100 text-red-800",
}

export function AnamnesisForm({ patientId, onCompleted }: Props) {
  const t = useTranslations("anamnesis")
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<AnamnesisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function processWithAi() {
    const filledAnswers: Record<string, string> = {}
    for (const key of ANAMNESIS_KEYS) {
      const answer = answers[key]?.trim()
      if (answer) filledAnswers[t(key)] = answer
    }

    if (Object.keys(filledAnswers).length < 3) {
      toast.error(t("minQuestions"))
      return
    }

    setLoading(true)
    try {
      const res = await api.post("/ai/anamnesis", {
        patientId,
        answers: filledAnswers,
      })
      setResult(res.data)
      setSaved(false)
      onCompleted?.(res.data)
    } catch (err: any) {
      const status = err?.response?.status
      const msg = err?.response?.data?.message
      if (status === 500) {
        toast.error(msg || t("serverError"))
      } else if (status === 401 || status === 403) {
        toast.error(t("sessionExpired"))
      } else if (status === 429) {
        toast.error(t("tooManyRequests"))
      } else if (!err?.response) {
        toast.error(t("noConnection"))
      } else {
        toast.error(msg || t("processError"))
      }
    } finally {
      setLoading(false)
    }
  }

  async function saveAnamnesis() {
    if (!result || !patientId) return
    setSaving(true)
    try {
      await api.post("/anamnesis", {
        patient_id: patientId,
        allergies: result.allergies || [],
        medications: result.medications || [],
        conditions: result.conditions || [],
        surgeries: answers.surgeries || null,
        habits: {
          smoking: answers.smoking || null,
          bruxism: answers.bruxism || null,
          breathing: answers.breathing || null,
          other: answers.habits || null,
        },
        risk_classification: result.riskClassification || null,
        contraindications: result.contraindications || [],
        alerts: result.alerts || [],
        warnings: result.warnings || [],
        ai_notes: result.notes || null,
        ai_recommendations: result.recommendations || null,
        raw_answers: answers,
      })
      toast.success(t("saveSuccess"))
      setSaved(true)
    } catch (err: any) {
      const msg = err?.response?.data?.message
      toast.error(msg || t("saveError"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Questions */}
      <div className="space-y-4">
        <h3 className="font-semibold">{t("title")}</h3>
        {ANAMNESIS_KEYS.map((key) => (
          <div key={key}>
            <label className="text-sm font-medium block mb-1">{t(key)}</label>
            <input
              type="text"
              value={answers[key] || ""}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [key]: e.target.value }))
              }
              placeholder={t("placeholder")}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        ))}
      </div>

      <Button onClick={processWithAi} disabled={loading} className="gap-2">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {t("processWithAi")}
      </Button>

      {/* Result */}
      {result && !result.raw && (
        <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">{t("reportTitle")}</h4>
            {result.riskClassification && (
              <span
                className={cn(
                  "text-xs font-bold px-2.5 py-1 rounded",
                  ASA_COLORS[result.riskClassification] || "bg-gray-100 text-gray-800"
                )}
              >
                {result.riskClassification}
              </span>
            )}
          </div>

          {/* Alerts */}
          {result.alerts && result.alerts.length > 0 && (
            <div className="space-y-1">
              {result.alerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-2 text-sm bg-red-50 text-red-800 p-2 rounded">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{alert}</span>
                </div>
              ))}
            </div>
          )}

          {/* Warnings */}
          {result.warnings && result.warnings.length > 0 && (
            <div className="space-y-1">
              {result.warnings.map((warning, i) => (
                <div key={i} className="flex items-start gap-2 text-sm bg-amber-50 text-amber-800 p-2 rounded">
                  <Shield className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{warning}</span>
                </div>
              ))}
            </div>
          )}

          {/* Allergies */}
          {result.allergies && result.allergies.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-1">{t("allergiesLabel")}</h5>
              <div className="flex flex-wrap gap-1.5">
                {result.allergies.map((a, i) => (
                  <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Medications */}
          {result.medications && result.medications.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-1 flex items-center gap-1">
                <Pill className="h-3 w-3" /> {t("medicationsLabel")}
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {result.medications.map((m, i) => (
                  <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Conditions */}
          {result.conditions && result.conditions.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-1">{t("conditionsLabel")}</h5>
              <ul className="text-sm space-y-0.5">
                {result.conditions.map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Contraindications */}
          {result.contraindications && result.contraindications.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-1">{t("contraindicationsLabel")}</h5>
              <ul className="text-sm space-y-0.5 text-orange-700">
                {result.contraindications.map((c, i) => (
                  <li key={i}>⚠ {c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes & Recommendations */}
          {result.notes && (
            <p className="text-sm text-muted-foreground">{result.notes}</p>
          )}
          {result.recommendations && (
            <div className="bg-primary/5 p-3 rounded-lg">
              <h5 className="text-xs font-semibold uppercase mb-1">{t("recommendationsLabel")}</h5>
              <p className="text-sm">{result.recommendations}</p>
            </div>
          )}

          {patientId && (
            <Button
              onClick={saveAnamnesis}
              disabled={saving || saved}
              variant={saved ? "outline" : "default"}
              className="gap-2"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saved ? t("saved") : t("saveAnamnesis")}
            </Button>
          )}
        </div>
      )}

      {result?.raw && (
        <div className="border rounded-lg p-4 bg-muted/30">
          <pre className="text-sm whitespace-pre-wrap">{result.raw}</pre>
        </div>
      )}
    </div>
  )
}
