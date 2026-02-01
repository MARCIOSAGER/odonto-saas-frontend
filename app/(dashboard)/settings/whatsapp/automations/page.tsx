"use client"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import {
  Clock,
  Cake,
  UserCheck,
  MessageCircle,
  Settings2,
  Save,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Automation {
  id: string
  type: string
  name: string
  is_active: boolean
  trigger_config: Record<string, unknown>
  action_config: Record<string, unknown>
  last_run_at: string | null
  run_count: number
  error_count: number
  last_error: string | null
}

const AUTOMATION_TYPES = [
  {
    type: "follow_up",
    name: "Follow-up pós-procedimento",
    description: "Envia mensagem automática após uma consulta concluída, perguntando como o paciente está se sentindo.",
    icon: MessageCircle,
    defaultTrigger: { hours_after: 2 },
    defaultAction: {
      template: "Olá {patientName}! Como você está se sentindo após o procedimento de {service}? Se tiver qualquer dúvida ou desconforto, não hesite em nos contatar. Equipe {clinicName}",
    },
  },
  {
    type: "birthday",
    name: "Mensagem de aniversário",
    description: "Envia mensagem no dia do aniversário do paciente (às 9h). Requer data de nascimento cadastrada.",
    icon: Cake,
    defaultTrigger: { time: "09:00" },
    defaultAction: {
      template: "Feliz aniversário, {patientName}! A equipe {clinicName} deseja um dia maravilhoso! Aproveite para cuidar do seu sorriso com condições especiais neste mês.",
    },
  },
  {
    type: "reactivation",
    name: "Reativação de pacientes inativos",
    description: "Contata pacientes que não visitam a clínica há meses, convidando-os a retornar. Roda semanalmente (segundas).",
    icon: UserCheck,
    defaultTrigger: { months_inactive: 3, max_per_run: 20 },
    defaultAction: {
      template: "Olá {patientName}! Sentimos sua falta na {clinicName}. Já faz um tempo desde sua última visita. Que tal agendar uma consulta de acompanhamento? Responda para verificar horários disponíveis!",
    },
  },
]

export default function WhatsAppAutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [editingTemplates, setEditingTemplates] = useState<Record<string, string>>({})
  const [editingConfigs, setEditingConfigs] = useState<Record<string, Record<string, number>>>({})

  useEffect(() => {
    loadAutomations()
  }, [])

  async function loadAutomations() {
    try {
      const res = await api.get("/automations")
      const data = Array.isArray(res.data) ? res.data : res.data?.data || []
      setAutomations(data)

      const templates: Record<string, string> = {}
      const configs: Record<string, Record<string, number>> = {}
      for (const auto of data) {
        const action = auto.action_config as Record<string, unknown>
        templates[auto.type] = (action?.template as string) || ""
        const trigger = auto.trigger_config as Record<string, unknown>
        configs[auto.type] = {}
        for (const [k, v] of Object.entries(trigger)) {
          if (typeof v === "number") configs[auto.type][k] = v
        }
      }
      setEditingTemplates(templates)
      setEditingConfigs(configs)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  function getAutomation(type: string) {
    return automations.find((a) => a.type === type)
  }

  async function toggleAutomation(type: string, isActive: boolean) {
    const existing = getAutomation(type)

    if (!existing) {
      // Create new automation
      const typeDef = AUTOMATION_TYPES.find((t) => t.type === type)!
      setSaving(type)
      try {
        await api.put(`/automations/${type}`, {
          name: typeDef.name,
          trigger_type: "scheduled",
          trigger_config: typeDef.defaultTrigger,
          action_type: "whatsapp",
          action_config: typeDef.defaultAction,
          is_active: isActive,
        })
        toast.success(`${typeDef.name} ${isActive ? "ativada" : "desativada"}`)
        await loadAutomations()
      } catch {
        toast.error("Erro ao salvar automação")
      } finally {
        setSaving(null)
      }
      return
    }

    setSaving(type)
    try {
      await api.patch(`/automations/${type}/toggle`, { is_active: isActive })
      toast.success(`Automação ${isActive ? "ativada" : "desativada"}`)
      setAutomations((prev) =>
        prev.map((a) => (a.type === type ? { ...a, is_active: isActive } : a))
      )
    } catch {
      toast.error("Erro ao atualizar automação")
    } finally {
      setSaving(null)
    }
  }

  async function saveConfig(type: string) {
    const typeDef = AUTOMATION_TYPES.find((t) => t.type === type)!
    const existing = getAutomation(type)

    const triggerConfig = {
      ...typeDef.defaultTrigger,
      ...(editingConfigs[type] || {}),
    }
    const actionConfig = {
      template: editingTemplates[type] || (typeDef.defaultAction as Record<string, unknown>).template,
    }

    setSaving(type)
    try {
      await api.put(`/automations/${type}`, {
        name: typeDef.name,
        trigger_type: "scheduled",
        trigger_config: triggerConfig,
        action_type: "whatsapp",
        action_config: actionConfig,
        is_active: existing?.is_active ?? false,
      })
      toast.success("Configuração salva")
      await loadAutomations()
    } catch {
      toast.error("Erro ao salvar")
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Automações WhatsApp</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configure mensagens automáticas para engajar pacientes
          </p>
        </div>
        <Link href="/settings/whatsapp">
          <Button variant="outline" size="sm" className="gap-2">
            <Settings2 className="h-4 w-4" />
            Configurações WhatsApp
          </Button>
        </Link>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
        <p>
          <strong>Lembretes de consulta</strong> (24h e 1h antes) são configurados na{" "}
          <Link href="/settings/ai" className="text-primary hover:underline">
            página de IA
          </Link>
          , seção &ldquo;Lembretes Automáticos&rdquo;.
        </p>
      </div>

      <div className="space-y-4">
        {AUTOMATION_TYPES.map((typeDef) => {
          const automation = getAutomation(typeDef.type)
          const isActive = automation?.is_active ?? false
          const Icon = typeDef.icon
          const template = editingTemplates[typeDef.type] ?? (typeDef.defaultAction as Record<string, unknown>).template as string

          return (
            <div
              key={typeDef.type}
              className="border rounded-xl p-5 space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{typeDef.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {typeDef.description}
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => toggleAutomation(typeDef.type, e.target.checked)}
                    disabled={saving === typeDef.type}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              {/* Config fields */}
              {typeDef.type === "follow_up" && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Enviar</span>
                  <input
                    type="number"
                    min={1}
                    max={48}
                    value={editingConfigs[typeDef.type]?.hours_after ?? 2}
                    onChange={(e) =>
                      setEditingConfigs((prev) => ({
                        ...prev,
                        [typeDef.type]: {
                          ...prev[typeDef.type],
                          hours_after: parseInt(e.target.value) || 2,
                        },
                      }))
                    }
                    className="w-16 px-2 py-1 border rounded text-center"
                  />
                  <span className="text-muted-foreground">horas após o procedimento</span>
                </div>
              )}

              {typeDef.type === "reactivation" && (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Contatar pacientes inativos há</span>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={editingConfigs[typeDef.type]?.months_inactive ?? 3}
                    onChange={(e) =>
                      setEditingConfigs((prev) => ({
                        ...prev,
                        [typeDef.type]: {
                          ...prev[typeDef.type],
                          months_inactive: parseInt(e.target.value) || 3,
                        },
                      }))
                    }
                    className="w-16 px-2 py-1 border rounded text-center"
                  />
                  <span className="text-muted-foreground">meses, máximo</span>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={editingConfigs[typeDef.type]?.max_per_run ?? 20}
                    onChange={(e) =>
                      setEditingConfigs((prev) => ({
                        ...prev,
                        [typeDef.type]: {
                          ...prev[typeDef.type],
                          max_per_run: parseInt(e.target.value) || 20,
                        },
                      }))
                    }
                    className="w-16 px-2 py-1 border rounded text-center"
                  />
                  <span className="text-muted-foreground">por execução</span>
                </div>
              )}

              {/* Template editor */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Mensagem</label>
                <textarea
                  value={template}
                  onChange={(e) =>
                    setEditingTemplates((prev) => ({
                      ...prev,
                      [typeDef.type]: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-xs text-muted-foreground">
                  Variáveis: {"{patientName}"}, {"{clinicName}"}
                  {typeDef.type === "follow_up" && <>, {"{service}"}, {"{dentist}"}</>}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {automation && (
                    <>
                      {automation.run_count > 0 && (
                        <span>Executado {automation.run_count}x</span>
                      )}
                      {automation.last_run_at && (
                        <span className="ml-3">
                          Última: {new Date(automation.last_run_at).toLocaleString("pt-BR")}
                        </span>
                      )}
                      {automation.error_count > 0 && (
                        <span className="ml-3 text-destructive">
                          {automation.error_count} erros
                        </span>
                      )}
                    </>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => saveConfig(typeDef.type)}
                  disabled={saving === typeDef.type}
                  className="gap-2"
                >
                  {saving === typeDef.type ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Save className="h-3 w-3" />
                  )}
                  Salvar
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
