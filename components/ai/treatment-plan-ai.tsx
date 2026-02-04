"use client"
import { useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Sparkles, Loader2, ChevronDown, ChevronUp, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface Procedure {
  tooth: number
  procedure: string
  reason: string
  estimatedCost: number
  sessions: number
}

interface Phase {
  name: string
  priority: string
  procedures: Procedure[]
  totalCost: number
  estimatedSessions: number
}

interface TreatmentPlan {
  patientSummary?: string
  phases?: Phase[]
  totalCost?: number
  totalSessions?: number
  recommendations?: string
  raw?: string
}

interface Props {
  patientId: string
}

const PRIORITY_COLORS: Record<string, string> = {
  urgente: "bg-red-100 text-red-800 border-red-200",
  importante: "bg-amber-100 text-amber-800 border-amber-200",
  eletivo: "bg-blue-100 text-blue-800 border-blue-200",
}

export function TreatmentPlanAi({ patientId }: Props) {
  const t = useTranslations("treatmentPlan")
  const [plan, setPlan] = useState<TreatmentPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([0]))

  async function generate() {
    setLoading(true)
    try {
      const res = await api.post(`/ai/treatment-plan/${patientId}`)
      setPlan(res.data)
      setSaved(false)
      setExpandedPhases(new Set([0]))
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
        toast.error(msg || t("generateError"))
      }
    } finally {
      setLoading(false)
    }
  }

  async function savePlan() {
    if (!plan) return
    setSaving(true)
    try {
      await api.post("/treatment-plans", {
        patient_id: patientId,
        patient_summary: plan.patientSummary || null,
        phases: plan.phases || null,
        total_cost: plan.totalCost || null,
        total_sessions: plan.totalSessions || null,
        recommendations: plan.recommendations || null,
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

  function togglePhase(index: number) {
    setExpandedPhases((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{t("title")}</h3>
          <p className="text-xs text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <Button onClick={generate} disabled={loading} size="sm" className="gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {plan ? t("regenerate") : t("generate")}
        </Button>
      </div>

      {plan && !plan.raw && (
        <div className="space-y-3">
          {plan.patientSummary && (
            <p className="text-sm bg-muted/50 p-3 rounded-lg">{plan.patientSummary}</p>
          )}

          {plan.phases?.map((phase, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => togglePhase(i)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase px-2 py-0.5 rounded border",
                      PRIORITY_COLORS[phase.priority] || "bg-gray-100 text-gray-800"
                    )}
                  >
                    {phase.priority}
                  </span>
                  <span className="font-medium text-sm">{phase.name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>R$ {phase.totalCost?.toFixed(2)}</span>
                  <span>{t("sessionsLabel", { count: phase.estimatedSessions })}</span>
                  {expandedPhases.has(i) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </button>

              {expandedPhases.has(i) && (
                <div className="border-t px-4 py-2">
                  {phase.procedures.map((proc, j) => (
                    <div
                      key={j}
                      className="flex items-center justify-between py-2 border-b last:border-b-0 text-sm"
                    >
                      <div>
                        <span className="font-medium">{t("tooth", { number: proc.tooth })}</span>
                        <span className="mx-2 text-muted-foreground">-</span>
                        <span>{proc.procedure}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {proc.reason}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <div className="font-medium">
                          R$ {proc.estimatedCost?.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t("sessions", { count: proc.sessions })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
            <span className="font-semibold">{t("totalEstimated")}</span>
            <div className="text-right">
              <div className="text-lg font-bold">
                R$ {plan.totalCost?.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("sessionsLabel", { count: plan.totalSessions ?? 0 })}
              </div>
            </div>
          </div>

          {plan.recommendations && (
            <div className="bg-muted/30 p-3 rounded-lg">
              <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                {t("recommendationsLabel")}
              </h5>
              <p className="text-sm">{plan.recommendations}</p>
            </div>
          )}

          <Button
            onClick={savePlan}
            disabled={saving || saved}
            variant={saved ? "outline" : "default"}
            className="gap-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saved ? t("saved") : t("savePlan")}
          </Button>
        </div>
      )}

      {plan?.raw && (
        <div className="border rounded-lg p-4 bg-muted/30">
          <pre className="text-sm whitespace-pre-wrap">{plan.raw}</pre>
        </div>
      )}
    </div>
  )
}
