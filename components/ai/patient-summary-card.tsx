"use client"
import { useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import {
  Sparkles,
  Loader2,
  AlertTriangle,
  AlertCircle,
  Heart,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PatientSummary {
  overview?: string
  riskFactors?: string[]
  oralHealthScore?: string
  adherence?: string
  financialSummary?: string
  recommendations?: string[]
  alerts?: string[]
  raw?: string
}

const HEALTH_SCORES: Record<string, { color: string; label: string }> = {
  bom: { color: "text-green-600 bg-green-50", label: "Bom" },
  regular: { color: "text-amber-600 bg-amber-50", label: "Regular" },
  "precisa atenção": { color: "text-orange-600 bg-orange-50", label: "Precisa atenção" },
  "crítico": { color: "text-red-600 bg-red-50", label: "Crítico" },
}

const ADHERENCE_MAP: Record<string, string> = {
  excelente: "text-green-600",
  boa: "text-blue-600",
  regular: "text-amber-600",
  baixa: "text-red-600",
}

interface Props {
  patientId: string
}

export function PatientSummaryCard({ patientId }: Props) {
  const [summary, setSummary] = useState<PatientSummary | null>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await api.get(`/ai/patient-summary/${patientId}`)
      setSummary(res.data)
    } catch (err: any) {
      const status = err?.response?.status
      const msg = err?.response?.data?.message
      if (status === 500) {
        toast.error(msg || "Erro interno do servidor. Verifique se a chave de IA (ANTHROPIC_API_KEY) está configurada.")
      } else if (status === 401 || status === 403) {
        toast.error("Sessão expirada. Faça login novamente.")
      } else if (status === 429) {
        toast.error("Muitas requisições. Aguarde um momento e tente novamente.")
      } else if (!err?.response) {
        toast.error("Sem conexão com o servidor. Verifique sua internet.")
      } else {
        toast.error(msg || "Erro ao gerar resumo do paciente.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (!summary) {
    return (
      <div className="border rounded-lg p-4 flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Resumo IA do paciente
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Análise inteligente do perfil, adesão e saúde bucal
          </p>
        </div>
        <Button onClick={load} disabled={loading} size="sm" variant="outline" className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Gerar resumo
        </Button>
      </div>
    )
  }

  if (summary.raw) {
    return (
      <div className="border rounded-lg p-4 bg-muted/30">
        <pre className="text-sm whitespace-pre-wrap">{summary.raw}</pre>
      </div>
    )
  }

  const healthScore = summary.oralHealthScore
    ? HEALTH_SCORES[summary.oralHealthScore.toLowerCase()] || HEALTH_SCORES["regular"]
    : null

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Resumo IA
        </h4>
        <Button onClick={load} disabled={loading} size="sm" variant="ghost" className="h-7 text-xs gap-1">
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <TrendingUp className="h-3 w-3" />}
          Atualizar
        </Button>
      </div>

      {/* Alerts */}
      {summary.alerts && summary.alerts.length > 0 && (
        <div className="space-y-1">
          {summary.alerts.map((alert, i) => (
            <div key={i} className="flex items-start gap-2 text-sm bg-red-50 text-red-800 p-2 rounded">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{alert}</span>
            </div>
          ))}
        </div>
      )}

      {/* Overview */}
      {summary.overview && (
        <p className="text-sm">{summary.overview}</p>
      )}

      {/* Scores */}
      <div className="flex flex-wrap gap-3">
        {healthScore && (
          <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", healthScore.color)}>
            <Heart className="h-3 w-3" />
            Saúde bucal: {healthScore.label}
          </div>
        )}
        {summary.adherence && (
          <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted", ADHERENCE_MAP[summary.adherence.toLowerCase()] || "text-muted-foreground")}>
            Adesão: {summary.adherence}
          </div>
        )}
      </div>

      {/* Risk Factors */}
      {summary.riskFactors && summary.riskFactors.length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-1">Fatores de risco</h5>
          <div className="flex flex-wrap gap-1.5">
            {summary.riskFactors.map((f, i) => (
              <span key={i} className="text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded">
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Financial */}
      {summary.financialSummary && (
        <p className="text-xs text-muted-foreground">{summary.financialSummary}</p>
      )}

      {/* Recommendations */}
      {summary.recommendations && summary.recommendations.length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-1">Próximos passos</h5>
          <ul className="text-sm space-y-1">
            {summary.recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
