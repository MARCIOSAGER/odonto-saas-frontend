"use client"
import { useEffect, useState, useCallback } from "react"
import { api } from "@/lib/api"
import { Loader2, FileText, Send, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Prescription {
  id: string
  type: string
  content: Record<string, unknown>
  sent_at: string | null
  sent_via: string | null
  created_at: string
  dentist: { name: string; cro: string }
}

interface Props {
  patientId: string
}

const TYPE_LABELS: Record<string, string> = {
  prescription: "Receituário",
  certificate: "Atestado",
  referral: "Encaminhamento",
}

export function PrescriptionList({ patientId }: Props) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const res = await api.get(`/prescriptions/patient/${patientId}`)
      setPrescriptions(Array.isArray(res.data) ? res.data : res.data?.data || [])
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [patientId])

  useEffect(() => {
    load()
  }, [load])

  async function sendViaWhatsApp(id: string) {
    try {
      await api.post(`/prescriptions/${id}/send`, { via: "whatsapp" })
      toast.success("Enviado por WhatsApp")
      load()
    } catch {
      toast.error("Erro ao enviar")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (prescriptions.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        Nenhum documento encontrado
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {prescriptions.map((p) => {
        const content = p.content as Record<string, unknown>
        const medications = content?.medications as Record<string, string>[] | undefined
        const text = content?.text as string | undefined

        return (
          <div key={p.id} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">
                  {TYPE_LABELS[p.type] || p.type}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(p.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {p.sent_at && (
                  <span className="text-xs text-green-600 mr-2">
                    Enviado via {p.sent_via}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => sendViaWhatsApp(p.id)}
                  className="h-7 gap-1 text-xs"
                  title="Enviar por WhatsApp"
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Dr(a). {p.dentist.name} - CRO {p.dentist.cro}
            </p>

            {/* Content preview */}
            {medications && medications.length > 0 && (
              <div className="bg-muted/30 rounded p-2 text-sm space-y-1">
                {medications.map((m, i) => (
                  <div key={i}>
                    <span className="font-medium">{m.name}</span>
                    {m.dosage && <span className="text-muted-foreground"> - {m.dosage}</span>}
                    {m.frequency && <span className="text-muted-foreground">, {m.frequency}</span>}
                    {m.duration && <span className="text-muted-foreground">, {m.duration}</span>}
                  </div>
                ))}
              </div>
            )}

            {text && (
              <p className="text-sm bg-muted/30 rounded p-2 line-clamp-3">{text}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
