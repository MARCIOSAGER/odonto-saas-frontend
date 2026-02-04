"use client"
import { useState, useEffect } from "react"
import { useClinic } from "@/hooks/useClinic"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Loader2, Save, Bot, Info, Zap, Eye, EyeOff,
  CheckCircle, XCircle, Key, Cpu, MessageSquare, Shield,
  MousePointer, Stethoscope, MapPin, Bell
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

const providers = [
  { id: "anthropic", name: "Claude", subtitle: "Anthropic", color: "bg-orange-500" },
  { id: "openai", name: "GPT", subtitle: "OpenAI", color: "bg-green-600" },
  { id: "google", name: "Gemini", subtitle: "Google", color: "bg-blue-500" },
]

interface ModelOption {
  value: string
  label: string
  pricing: string
  badge?: "economico" | "recomendado" | "premium" | "gratis"
}

const modelOptions: Record<string, ModelOption[]> = {
  anthropic: [
    { value: "claude-3-5-haiku-20241022", label: "Claude Haiku 3.5", pricing: "$0.25 / $1.25 por 1M tokens", badge: "economico" },
    { value: "claude-haiku-4-5-20251101", label: "Claude Haiku 4.5", pricing: "$1.00 / $5.00 por 1M tokens" },
    { value: "claude-sonnet-4-20250514", label: "Claude Sonnet 4", pricing: "$3.00 / $15.00 por 1M tokens", badge: "recomendado" },
    { value: "claude-sonnet-4-5-20251101", label: "Claude Sonnet 4.5", pricing: "$3.00 / $15.00 por 1M tokens" },
    { value: "claude-opus-4-5-20251101", label: "Claude Opus 4.5", pricing: "$5.00 / $25.00 por 1M tokens", badge: "premium" },
  ],
  openai: [
    { value: "gpt-4o-mini", label: "GPT-4o Mini", pricing: "$0.15 / $0.60 por 1M tokens", badge: "economico" },
    { value: "gpt-4.1-mini", label: "GPT-4.1 Mini", pricing: "$0.40 / $1.60 por 1M tokens" },
    { value: "gpt-4o", label: "GPT-4o", pricing: "$2.50 / $10.00 por 1M tokens", badge: "recomendado" },
    { value: "gpt-4.1", label: "GPT-4.1", pricing: "$2.00 / $8.00 por 1M tokens" },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo", pricing: "$10.00 / $30.00 por 1M tokens", badge: "premium" },
  ],
  google: [
    { value: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash-Lite", pricing: "$0.075 / $0.30 por 1M tokens", badge: "economico" },
    { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash", pricing: "$0.10 / $0.40 por 1M tokens" },
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash", pricing: "$0.15 / $0.60 por 1M tokens", badge: "recomendado" },
    { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro", pricing: "$1.25 / $5.00 por 1M tokens" },
    { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro", pricing: "$1.25 / $10.00 por 1M tokens", badge: "premium" },
  ],
}

const badgeStyles: Record<string, { className: string }> = {
  economico: { className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  recomendado: { className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  premium: { className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  gratis: { className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
}

export default function AISettingsPage() {
  const { aiSettings, isLoadingAI, updateAISettings, testAI } = useClinic()
  const t = useTranslations("aiSettings")

  const badgeLabels: Record<string, string> = {
    economico: t("badgeEconomic"),
    recomendado: t("badgeRecommended"),
    premium: t("badgePremium"),
    gratis: t("badgeFree"),
  }

  const providerInfo: Record<string, string> = {
    anthropic: t("providerInfoAnthropic"),
    openai: t("providerInfoOpenai"),
    google: t("providerInfoGoogle"),
  }

  const [settings, setSettings] = useState<any>({
    ai_enabled: true,
    ai_provider: "anthropic",
    ai_api_key: "",
    ai_model: "claude-3-5-haiku-20241022",
    ai_temperature: 0.7,
    max_tokens: 800,
    assistant_name: "Sofia",
    assistant_personality: "Amigável, profissional e prestativa",
    welcome_message: "Olá! Eu sou a Sofia, sua assistente virtual. Como posso ajudar hoje?",
    fallback_message: "Desculpe, não entendi. Pode repetir?",
    out_of_hours_message: "Estamos fora do horário de atendimento. Retornaremos em breve!",
    auto_schedule: false,
    auto_confirm: false,
    auto_cancel: false,
    notify_on_transfer: true,
    working_hours_only: false,
    context_messages: 10,
    custom_instructions: "",
    transfer_keywords: "",
    blocked_topics: "",
    use_welcome_menu: false,
    use_confirmation_buttons: false,
    use_timeslot_list: false,
    use_satisfaction_poll: false,
    use_send_location: false,
    dentist_ai_enabled: false,
    reminder_enabled: true,
    reminder_24h: true,
    reminder_1h: true,
    reminder_message_24h: "",
    reminder_message_1h: "",
  })

  const [showApiKey, setShowApiKey] = useState(false)
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle")

  useEffect(() => {
    if (aiSettings) {
      setSettings((prev: any) => ({
        ...prev,
        ...aiSettings,
        transfer_keywords: Array.isArray(aiSettings.transfer_keywords)
          ? aiSettings.transfer_keywords.join(", ")
          : aiSettings.transfer_keywords || "",
        blocked_topics: Array.isArray(aiSettings.blocked_topics)
          ? aiSettings.blocked_topics.join(", ")
          : aiSettings.blocked_topics || "",
        ai_api_key: "",
      }))
    }
  }, [aiSettings])

  const handleProviderChange = (providerId: string) => {
    const models = modelOptions[providerId] || []
    setSettings((prev: any) => ({
      ...prev,
      ai_provider: providerId,
      ai_model: models[0]?.value || "",
      ai_api_key: "",
    }))
    setTestStatus("idle")
  }

  const handleTestConnection = async () => {
    setTestStatus("testing")
    try {
      await handleSaveInternal()
      const result = await testAI.mutateAsync()
      if (result?.success) {
        setTestStatus("success")
      } else {
        setTestStatus("error")
      }
    } catch {
      setTestStatus("error")
    }
  }

  const handleSaveInternal = async () => {
    const {
      id, clinic_id, created_at, updated_at,
      ai_api_key_masked, ai_api_key_set,
      ...cleanSettings
    } = settings

    const payload: any = {
      ...cleanSettings,
      transfer_keywords: typeof cleanSettings.transfer_keywords === "string"
        ? cleanSettings.transfer_keywords.split(",").map((s: string) => s.trim()).filter(Boolean)
        : cleanSettings.transfer_keywords || [],
      blocked_topics: typeof cleanSettings.blocked_topics === "string"
        ? cleanSettings.blocked_topics.split(",").map((s: string) => s.trim()).filter(Boolean)
        : cleanSettings.blocked_topics || [],
    }

    if (!payload.ai_api_key) {
      delete payload.ai_api_key
    }

    await updateAISettings.mutateAsync(payload)
  }

  const handleSave = async () => {
    try {
      await handleSaveInternal()
    } catch {
      // Erro já tratado no hook
    }
  }

  if (isLoadingAI) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const currentModels = modelOptions[settings.ai_provider] || []

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{t("title")}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("subtitle")}</p>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
          <Switch
            checked={settings.ai_enabled}
            onCheckedChange={(v: boolean) => setSettings({ ...settings, ai_enabled: v })}
            className="scale-75"
          />
          {settings.ai_enabled ? t("aiActive") : t("aiInactive")}
        </div>
      </div>

      <div className="grid gap-6">
        {/* Provedor de IA */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Cpu size={20} className="text-primary" />
              {t("providerAndModel")}
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              {t("providerAndModelDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Seleção de provedor */}
            <div className="grid grid-cols-3 gap-3">
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleProviderChange(p.id)}
                  className={cn(
                    "relative p-4 rounded-xl border-2 transition-all text-left",
                    settings.ai_provider === p.id
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-gray-300 dark:hover:border-gray-600"
                  )}
                >
                  <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold mb-2", p.color)}>
                    {p.name.charAt(0)}
                  </div>
                  <div className="font-bold text-sm text-gray-900 dark:text-gray-100">{p.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{p.subtitle}</div>
                  {settings.ai_provider === p.id && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle size={16} className="text-primary" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            {providerInfo[settings.ai_provider] && (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">{providerInfo[settings.ai_provider]}</p>
            )}

            {/* API Key */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Key size={14} />
                {`${t("apiKey")} - ${providers.find(p => p.id === settings.ai_provider)?.name}`}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={settings.ai_api_key}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, ai_api_key: e.target.value })}
                    placeholder={
                      aiSettings?.ai_api_key_set
                        ? t("apiKeyConfigured", { mask: aiSettings.ai_api_key_masked || "****" })
                        : t("apiKeyPlaceholder")
                    }
                    className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100 pr-10 font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {aiSettings?.ai_api_key_set && !settings.ai_api_key && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle size={12} />
                  {t("apiKeyConfiguredHint")}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {settings.ai_provider === "anthropic" && t("apiKeyHintAnthropic")}
                {settings.ai_provider === "openai" && t("apiKeyHintOpenai")}
                {settings.ai_provider === "google" && t("apiKeyHintGoogle")}
              </p>
            </div>

            {/* Modelo */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("model")}</label>
              <div className="grid gap-2">
                {currentModels.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setSettings({ ...settings, ai_model: m.value })}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border transition-all text-left",
                      settings.ai_model === m.value
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-gray-300 dark:hover:border-gray-600 bg-muted/10"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-4 w-4 rounded-full border-2 flex items-center justify-center",
                        settings.ai_model === m.value ? "border-primary" : "border-gray-300 dark:border-gray-600"
                      )}>
                        {settings.ai_model === m.value && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{m.label}</span>
                          {m.badge && badgeStyles[m.badge] && (
                            <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded", badgeStyles[m.badge].className)}>
                              {badgeLabels[m.badge]}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">{m.pricing}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-gray-400">{t("pricingNote")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t("temperature", { value: settings.ai_temperature })}
                </label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={settings.ai_temperature}
                  onChange={(e) => setSettings({ ...settings, ai_temperature: parseFloat(e.target.value) })}
                  className="w-full h-11 accent-primary"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>{t("precise")}</span>
                  <span>{t("creative")}</span>
                </div>
              </div>
            </div>

            {/* Testar conexão */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleTestConnection}
                disabled={testAI.isPending}
              >
                {testAI.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Zap size={14} />
                )}
                {t("testConnection")}
              </Button>
              {testStatus === "success" && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle size={14} />
                  {t("connectionSuccess")}
                </span>
              )}
              {testStatus === "error" && (
                <span className="text-sm text-red-600 flex items-center gap-1">
                  <XCircle size={14} />
                  {t("connectionError")}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Identidade e Personalidade */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Bot size={20} className="text-primary" />
              {t("identityTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("assistantName")}</label>
                <Input
                  value={settings.assistant_name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, assistant_name: e.target.value })}
                  placeholder={t("assistantNamePlaceholder")}
                  className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("personality")}</label>
                <Input
                  value={settings.assistant_personality || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, assistant_personality: e.target.value })}
                  placeholder={t("personalityPlaceholder")}
                  className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("welcomeMessage")}</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border-none bg-muted/30 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={settings.welcome_message || ""}
                onChange={(e) => setSettings({ ...settings, welcome_message: e.target.value })}
                placeholder={t("welcomeMessagePlaceholder")}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("fallbackMessage")}</label>
                <Input
                  value={settings.fallback_message || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, fallback_message: e.target.value })}
                  placeholder={t("fallbackPlaceholder")}
                  className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("outOfHours")}</label>
                <Input
                  value={settings.out_of_hours_message || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, out_of_hours_message: e.target.value })}
                  placeholder={t("outOfHoursPlaceholder")}
                  className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Capacidades e Permissões */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Shield size={20} className="text-primary" />
              {t("capabilitiesTitle")}
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">{t("capabilitiesDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <PermissionToggle
              label={t("autoSchedule")}
              description={t("autoScheduleDesc")}
              checked={settings.auto_schedule}
              onChange={(v) => setSettings({ ...settings, auto_schedule: v })}
            />
            <PermissionToggle
              label={t("autoConfirm")}
              description={t("autoConfirmDesc")}
              checked={settings.auto_confirm}
              onChange={(v) => setSettings({ ...settings, auto_confirm: v })}
            />
            <PermissionToggle
              label={t("autoCancel")}
              description={t("autoCancelDesc")}
              checked={settings.auto_cancel}
              onChange={(v) => setSettings({ ...settings, auto_cancel: v })}
            />
            <PermissionToggle
              label={t("notifyTransfer")}
              description={t("notifyTransferDesc")}
              checked={settings.notify_on_transfer}
              onChange={(v) => setSettings({ ...settings, notify_on_transfer: v })}
            />
            <PermissionToggle
              label={t("workingHoursOnly")}
              description={t("workingHoursOnlyDesc")}
              checked={settings.working_hours_only}
              onChange={(v) => setSettings({ ...settings, working_hours_only: v })}
            />
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-muted/10">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t("contextMessages")}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{t("contextMessagesDesc")}</p>
              </div>
              <Input
                type="number"
                min={1}
                max={50}
                value={settings.context_messages}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, context_messages: parseInt(e.target.value) || 10 })}
                className="w-20 h-9 bg-muted/30 border-none text-center text-gray-900 dark:text-gray-100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Instruções Avançadas */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <MessageSquare size={20} className="text-primary" />
              {t("advancedTitle")}
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">{t("advancedDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("customInstructions")}</label>
              <textarea
                className="flex min-h-[120px] w-full rounded-md border-none bg-muted/30 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={settings.custom_instructions || ""}
                onChange={(e) => setSettings({ ...settings, custom_instructions: e.target.value })}
                placeholder={t("customInstructionsPlaceholder")}
              />
              <p className="text-[10px] text-gray-400">{t("customInstructionsHint")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("transferKeywords")}</label>
                <Input
                  value={settings.transfer_keywords}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, transfer_keywords: e.target.value })}
                  placeholder={t("transferKeywordsPlaceholder")}
                  className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
                />
                <p className="text-[10px] text-gray-400">{t("transferKeywordsHint")}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("blockedTopics")}</label>
                <Input
                  value={settings.blocked_topics}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, blocked_topics: e.target.value })}
                  placeholder={t("blockedTopicsPlaceholder")}
                  className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
                />
                <p className="text-[10px] text-gray-400">{t("blockedTopicsHint")}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <Info size={14} className="shrink-0 mt-0.5 text-blue-500" />
              <p><strong>{t("tip")}:</strong> {t("advancedTip")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Mensagens Interativas */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <MousePointer size={20} className="text-primary" />
              {t("interactiveTitle")}
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              {t("interactiveDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <PermissionToggle
              label={t("welcomeMenu")}
              description={t("welcomeMenuDesc")}
              checked={settings.use_welcome_menu}
              onChange={(v) => setSettings({ ...settings, use_welcome_menu: v })}
            />
            <PermissionToggle
              label={t("confirmationButtons")}
              description={t("confirmationButtonsDesc")}
              checked={settings.use_confirmation_buttons}
              onChange={(v) => setSettings({ ...settings, use_confirmation_buttons: v })}
            />
            <PermissionToggle
              label={t("timeslotList")}
              description={t("timeslotListDesc")}
              checked={settings.use_timeslot_list}
              onChange={(v) => setSettings({ ...settings, use_timeslot_list: v })}
            />
            <PermissionToggle
              label={t("satisfactionPoll")}
              description={t("satisfactionPollDesc")}
              checked={settings.use_satisfaction_poll}
              onChange={(v) => setSettings({ ...settings, use_satisfaction_poll: v })}
            />
            <PermissionToggle
              label={t("sendLocation")}
              description={t("sendLocationDesc")}
              checked={settings.use_send_location}
              onChange={(v) => setSettings({ ...settings, use_send_location: v })}
            />
            {settings.use_send_location && (
              <div className="sm:col-span-2 flex items-start gap-2 p-3 rounded-lg bg-muted/20 border border-border">
                <MapPin size={16} className="shrink-0 mt-1 text-primary" />
                <div className="flex-1 space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t("sendLocationHint")}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dentista via WhatsApp */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Stethoscope size={20} className="text-primary" />
              {t("dentistWhatsappTitle")}
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              {t("dentistWhatsappDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PermissionToggle
              label={t("enableDentistAi")}
              description={t("enableDentistAiDesc")}
              checked={settings.dentist_ai_enabled}
              onChange={(v) => setSettings({ ...settings, dentist_ai_enabled: v })}
            />
            {settings.dentist_ai_enabled && (
              <div className="flex items-start gap-2 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <Info size={14} className="shrink-0 mt-0.5 text-blue-500" />
                <div>
                  <p><strong>{t("howItWorks")}:</strong> {t("dentistAiHow")}</p>
                  <ul className="mt-1 space-y-0.5 list-disc list-inside">
                    <li>{t("dentistAiFeature1")}</li>
                    <li>{t("dentistAiFeature2")}</li>
                    <li>{t("dentistAiFeature3")}</li>
                    <li>{t("dentistAiFeature4")}</li>
                  </ul>
                  <p className="mt-1 text-[10px] opacity-75">{t("dentistAiNote")}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lembretes Automáticos */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Bell size={20} className="text-primary" />
              {t("remindersTitle")}
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              {t("remindersDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PermissionToggle
              label={t("enableReminders")}
              description={t("enableRemindersDesc")}
              checked={settings.reminder_enabled}
              onChange={(v) => setSettings({ ...settings, reminder_enabled: v })}
            />
            {settings.reminder_enabled && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <PermissionToggle
                    label={t("reminder24h")}
                    description={t("reminder24hDesc")}
                    checked={settings.reminder_24h}
                    onChange={(v) => setSettings({ ...settings, reminder_24h: v })}
                  />
                  <PermissionToggle
                    label={t("reminder1h")}
                    description={t("reminder1hDesc")}
                    checked={settings.reminder_1h}
                    onChange={(v) => setSettings({ ...settings, reminder_1h: v })}
                  />
                </div>
                {settings.reminder_24h && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("reminderMessage24h")}</label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border-none bg-muted/30 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={settings.reminder_message_24h || ""}
                      onChange={(e) => setSettings({ ...settings, reminder_message_24h: e.target.value })}
                      placeholder={t("reminderMessagePlaceholder")}
                    />
                  </div>
                )}
                {settings.reminder_1h && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("reminderMessage1h")}</label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border-none bg-muted/30 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={settings.reminder_message_1h || ""}
                      onChange={(e) => setSettings({ ...settings, reminder_message_1h: e.target.value })}
                      placeholder={t("reminderMessagePlaceholder")}
                    />
                  </div>
                )}
                <div className="flex items-start gap-2 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Info size={14} className="shrink-0 mt-0.5 text-blue-500" />
                  <div>
                    <p><strong>{t("howItWorks")}:</strong> {t("reminderHow")}</p>
                    <p className="mt-1">{t("reminderConfirmNote")}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button
            size="lg"
            className="w-full sm:w-auto px-12 gap-2 shadow-lg shadow-primary/20"
            onClick={handleSave}
            disabled={updateAISettings.isPending}
          >
            {updateAISettings.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={18} />}
            {t("saveAll")}
          </Button>
        </div>
      </div>
    </div>
  )
}

function PermissionToggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-muted/10">
      <div className="space-y-0.5">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
