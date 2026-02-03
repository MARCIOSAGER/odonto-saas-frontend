"use client"
import { useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Sparkles, Loader2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ClinicalNotes {
  complaint?: string
  examination?: string
  diagnosis?: string
  procedure?: string
  prescription?: string | null
  instructions?: string
  followUp?: string | null
  summary?: string
  raw?: string
}

interface Props {
  patientId?: string
  appointmentId?: string
  onGenerated?: (notes: ClinicalNotes) => void
}

export function ClinicalNotesGenerator({ patientId, appointmentId, onGenerated }: Props) {
  const [freeText, setFreeText] = useState("")
  const [notes, setNotes] = useState<ClinicalNotes | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function generate() {
    if (!freeText.trim()) {
      toast.error("Digite as anotações para gerar o prontuário")
      return
    }

    setLoading(true)
    try {
      const res = await api.post("/ai/clinical-notes", {
        freeText: freeText.trim(),
        patientId,
        appointmentId,
      })
      const data = res.data
      setNotes(data)
      onGenerated?.(data)
    } catch (err: any) {
      const status = err?.response?.status
      const msg = err?.response?.data?.message
      if (status === 500) {
        toast.error(msg || "Erro interno do servidor. Verifique se a chave de IA está configurada.")
      } else if (status === 401 || status === 403) {
        toast.error("Sessão expirada. Faça login novamente.")
      } else if (status === 429) {
        toast.error("Muitas requisições. Aguarde um momento e tente novamente.")
      } else if (!err?.response) {
        toast.error("Sem conexão com o servidor. Verifique sua internet.")
      } else {
        toast.error(msg || "Erro ao gerar prontuário.")
      }
    } finally {
      setLoading(false)
    }
  }

  function formatNotes(): string {
    if (!notes) return ""
    if (notes.raw) return notes.raw

    const sections = []
    if (notes.complaint) sections.push(`QUEIXA PRINCIPAL:\n${notes.complaint}`)
    if (notes.examination) sections.push(`EXAME CLÍNICO:\n${notes.examination}`)
    if (notes.diagnosis) sections.push(`DIAGNÓSTICO:\n${notes.diagnosis}`)
    if (notes.procedure) sections.push(`PROCEDIMENTO REALIZADO:\n${notes.procedure}`)
    if (notes.prescription) sections.push(`PRESCRIÇÃO:\n${notes.prescription}`)
    if (notes.instructions) sections.push(`ORIENTAÇÕES:\n${notes.instructions}`)
    if (notes.followUp) sections.push(`RETORNO:\n${notes.followUp}`)
    return sections.join("\n\n")
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(formatNotes())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1.5 block">
          Anotações do atendimento
        </label>
        <textarea
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          placeholder="Ex: Paciente chegou com dor no dente 36, exame mostrou cárie profunda mesial, realizada restauração com resina composta, orientado a evitar alimentos duros por 24h..."
          rows={5}
          className="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <Button onClick={generate} disabled={loading || !freeText.trim()} className="gap-2">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        Gerar prontuário
      </Button>

      {notes && !notes.raw && (
        <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Prontuário Estruturado</h4>
            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="gap-1.5 h-7">
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copiado" : "Copiar"}
            </Button>
          </div>

          {notes.summary && (
            <p className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-md">
              {notes.summary}
            </p>
          )}

          {notes.complaint && (
            <Section title="Queixa Principal" content={notes.complaint} />
          )}
          {notes.examination && (
            <Section title="Exame Clínico" content={notes.examination} />
          )}
          {notes.diagnosis && (
            <Section title="Diagnóstico" content={notes.diagnosis} />
          )}
          {notes.procedure && (
            <Section title="Procedimento Realizado" content={notes.procedure} />
          )}
          {notes.prescription && (
            <Section title="Prescrição" content={notes.prescription} />
          )}
          {notes.instructions && (
            <Section title="Orientações" content={notes.instructions} />
          )}
          {notes.followUp && (
            <Section title="Retorno" content={notes.followUp} />
          )}
        </div>
      )}

      {notes?.raw && (
        <div className="border rounded-lg p-4 bg-muted/30">
          <pre className="text-sm whitespace-pre-wrap">{notes.raw}</pre>
        </div>
      )}
    </div>
  )
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {title}
      </h5>
      <p className="text-sm mt-0.5">{content}</p>
    </div>
  )
}
