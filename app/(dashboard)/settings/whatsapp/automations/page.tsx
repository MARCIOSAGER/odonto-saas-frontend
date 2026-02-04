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
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"

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

export default function WhatsAppAutomationsPage() {
  const t = useTranslations("automations")
  const locale = useLocale()

  const AUTOMATION_TYPES = [
    {
      type: "follow_up",
      name: t("followUpName"),
      description: t("followUpDesc"),
      icon: MessageCircle,
      defaultTrigger: { hours_after: 2 },
      defaultAction: {
        template: t.raw("followUpTemplate"),
      },
    },
    {
      type: "birthday",
      name: t("birthdayName"),
      description: t("birthdayDesc"),
      icon: Cake,
      defaultTrigger: { time: "09:00" },
      defaultAction: {
        template: t.raw("birthdayTemplate"),
      },
    },
    {
      type: "reactivation",
      name: t("reactivationName"),
      description: t("reactivationDesc"),
      icon: UserCheck,
      defaultTrigger: { months_inactive: 3, max_per_run: 20 },
      defaultAction: {
        template: t.raw("reactivationTemplate"),
      },
    },
  ]

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
        toast.success(`${typeDef.name} ${isActive ? t("activated") : t("deactivated")}`)
        await loadAutomations()
      } catch {
        toast.error(t("saveAutomationError"))
      } finally {
        setSaving(null)
      }
      return
    }

    setSaving(type)
    try {
      await api.patch(`/automations/${type}/toggle`, { is_active: isActive })
      toast.success(`${existing.name} ${isActive ? t("activated") : t("deactivated")}`)
      setAutomations((prev) =>
        prev.map((a) => (a.type === type ? { ...a, is_active: isActive } : a))
      )
    } catch {
      toast.error(t("toggleError"))
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
      toast.success(t("configSaved"))
      await loadAutomations()
    } catch {
      toast.error(t("configSaveError"))
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
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t("subtitle")}
          </p>
        </div>
        <Link href="/settings/whatsapp">
          <Button variant="outline" size="sm" className="gap-2">
            <Settings2 className="h-4 w-4" />
            {t("whatsappSettings")}
          </Button>
        </Link>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
        <p>
          <strong>{t("remindersNote").split(t("aiPage"))[0]}</strong>
          <Link href="/settings/ai" className="text-primary hover:underline">
            {t("aiPage")}
          </Link>
          {t("remindersNote").split(t("aiPage"))[1]}
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
                  <span className="text-muted-foreground">{t("sendLabel")}</span>
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
                  <span className="text-muted-foreground">{t("hoursAfter")}</span>
                </div>
              )}

              {typeDef.type === "reactivation" && (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{t("contactInactive")}</span>
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
                  <span className="text-muted-foreground">{t("months")}</span>
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
                  <span className="text-muted-foreground">{t("perRun")}</span>
                </div>
              )}

              {/* Template editor */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("messageLabel")}</label>
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
                  {t.raw(typeDef.type === "follow_up" ? "variablesHintFollowUp" : "variablesHint")}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {automation && (
                    <>
                      {automation.run_count > 0 && (
                        <span>{t("executedCount", { count: automation.run_count })}</span>
                      )}
                      {automation.last_run_at && (
                        <span className="ml-3">
                          {t("lastRun", { date: new Date(automation.last_run_at).toLocaleString(locale) })}
                        </span>
                      )}
                      {automation.error_count > 0 && (
                        <span className="ml-3 text-destructive">
                          {t("errorCount", { count: automation.error_count })}
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
                  {t("save")}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
