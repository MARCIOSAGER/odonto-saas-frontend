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
  MousePointer, Stethoscope, MapPin
} from "lucide-react"
import { cn } from "@/lib/utils"

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

const badgeStyles: Record<string, { label: string; className: string }> = {
  economico: { label: "Econômico", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  recomendado: { label: "Recomendado", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  premium: { label: "Premium", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  gratis: { label: "Grátis", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
}

const providerInfo: Record<string, string> = {
  anthropic: "Excelente compreensão de contexto e tom profissional. Ideal para atendimento ao paciente.",
  openai: "Grande variedade de modelos. GPT-4o Mini é a opção mais econômica do mercado.",
  google: "Modelos Flash são muito rápidos e econômicos. Gemini 2.5 Flash tem tier gratuito generoso.",
}

export default function AISettingsPage() {
  const { aiSettings, isLoadingAI, updateAISettings, testAI } = useClinic()

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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Assistente de IA</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure a inteligência artificial que atende seus pacientes via WhatsApp.</p>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
          <Switch
            checked={settings.ai_enabled}
            onCheckedChange={(v: boolean) => setSettings({ ...settings, ai_enabled: v })}
            className="scale-75"
          />
          {settings.ai_enabled ? "IA Ativa" : "IA Inativa"}
        </div>
      </div>

      <div className="grid gap-6">
        {/* Provedor de IA */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Cpu size={20} className="text-primary" />
              Provedor e Modelo
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Escolha qual provedor de IA será usado para gerar as respostas.
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
                API Key - {providers.find(p => p.id === settings.ai_provider)?.name}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={settings.ai_api_key}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, ai_api_key: e.target.value })}
                    placeholder={
                      aiSettings?.ai_api_key_set
                        ? `Chave configurada (${aiSettings.ai_api_key_masked || "****"})`
                        : "Cole sua API Key aqui..."
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
                  Chave API configurada. Deixe em branco para manter a atual.
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {settings.ai_provider === "anthropic" && "Obtenha sua chave em console.anthropic.com"}
                {settings.ai_provider === "openai" && "Obtenha sua chave em platform.openai.com"}
                {settings.ai_provider === "google" && "Obtenha sua chave em aistudio.google.com"}
              </p>
            </div>

            {/* Modelo */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Modelo</label>
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
                              {badgeStyles[m.badge].label}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">{m.pricing}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-gray-400">Preços: entrada / saída por 1 milhão de tokens. Uma conversa típica consome ~500-2000 tokens.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Temperatura ({settings.ai_temperature})
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
                  <span>Preciso</span>
                  <span>Criativo</span>
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
                Testar Conexão
              </Button>
              {testStatus === "success" && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle size={14} />
                  Conexão funcionando!
                </span>
              )}
              {testStatus === "error" && (
                <span className="text-sm text-red-600 flex items-center gap-1">
                  <XCircle size={14} />
                  Falha na conexão. Verifique a API Key.
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
              Identidade e Personalidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nome da Assistente</label>
                <Input
                  value={settings.assistant_name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, assistant_name: e.target.value })}
                  placeholder="Ex: Sofia"
                  className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Personalidade</label>
                <Input
                  value={settings.assistant_personality || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, assistant_personality: e.target.value })}
                  placeholder="Amigável, profissional e prestativa"
                  className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mensagem de Boas-vindas</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border-none bg-muted/30 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={settings.welcome_message || ""}
                onChange={(e) => setSettings({ ...settings, welcome_message: e.target.value })}
                placeholder="Mensagem enviada quando o paciente inicia uma conversa..."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mensagem de Fallback</label>
                <Input
                  value={settings.fallback_message || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, fallback_message: e.target.value })}
                  placeholder="Quando a IA não entende..."
                  className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Fora do Horário</label>
                <Input
                  value={settings.out_of_hours_message || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, out_of_hours_message: e.target.value })}
                  placeholder="Mensagem fora do expediente..."
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
              Capacidades e Permissões
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">Defina o que a IA tem autonomia para fazer no sistema.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <PermissionToggle
              label="Agendar Consultas"
              description="Permitir que a IA crie novos agendamentos."
              checked={settings.auto_schedule}
              onChange={(v) => setSettings({ ...settings, auto_schedule: v })}
            />
            <PermissionToggle
              label="Confirmar Consultas"
              description="A IA pode confirmar agendamentos automaticamente."
              checked={settings.auto_confirm}
              onChange={(v) => setSettings({ ...settings, auto_confirm: v })}
            />
            <PermissionToggle
              label="Cancelar Consultas"
              description="Permitir cancelamentos via chat."
              checked={settings.auto_cancel}
              onChange={(v) => setSettings({ ...settings, auto_cancel: v })}
            />
            <PermissionToggle
              label="Notificar Transferência"
              description="Avisar quando transferir para humano."
              checked={settings.notify_on_transfer}
              onChange={(v) => setSettings({ ...settings, notify_on_transfer: v })}
            />
            <PermissionToggle
              label="Só Horário Comercial"
              description="A IA só responde durante o horário de funcionamento."
              checked={settings.working_hours_only}
              onChange={(v) => setSettings({ ...settings, working_hours_only: v })}
            />
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-muted/10">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Mensagens de Contexto</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Quantas mensagens anteriores enviar para a IA.</p>
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
              Instruções Avançadas
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">Dê diretrizes específicas sobre o atendimento da sua clínica.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Instruções Customizadas</label>
              <textarea
                className="flex min-h-[120px] w-full rounded-md border-none bg-muted/30 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={settings.custom_instructions || ""}
                onChange={(e) => setSettings({ ...settings, custom_instructions: e.target.value })}
                placeholder={"Exemplos:\n- Sempre mencione que temos estacionamento gratuito\n- Aceitamos cartão de crédito em até 12x\n- Priorize agendamentos para o período da manhã\n- Ofereça 10% de desconto para pacientes novos\n- Nosso diferencial é o atendimento humanizado"}
              />
              <p className="text-[10px] text-gray-400">Máximo 2000 caracteres. Use para regras específicas do seu atendimento.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Transferência para Humano</label>
                <Input
                  value={settings.transfer_keywords}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, transfer_keywords: e.target.value })}
                  placeholder="reclamação, humano, atendente, gerente, insatisfeito"
                  className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
                />
                <p className="text-[10px] text-gray-400">Separadas por vírgula. Quando o paciente usar essas palavras, a IA encerra e transfere para atendente humano.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tópicos que a IA não deve abordar</label>
                <Input
                  value={settings.blocked_topics}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, blocked_topics: e.target.value })}
                  placeholder="política, religião, concorrentes, diagnóstico"
                  className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
                />
                <p className="text-[10px] text-gray-400">Separados por vírgula. A IA recusará educadamente falar sobre esses assuntos.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <Info size={14} className="shrink-0 mt-0.5 text-blue-500" />
              <p><strong>Dica:</strong> A IA já tem acesso automático aos seus serviços, preços, dentistas e horários disponíveis. Você não precisa repetir essas informações nas instruções customizadas. Use este campo apenas para regras específicas da sua clínica.</p>
            </div>
          </CardContent>
        </Card>

        {/* Mensagens Interativas */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <MousePointer size={20} className="text-primary" />
              Mensagens Interativas
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Configure menus, botões e pesquisas interativas no WhatsApp para uma experiência mais rica.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <PermissionToggle
              label="Menu de Boas-vindas"
              description="Lista de opções quando o paciente inicia conversa."
              checked={settings.use_welcome_menu}
              onChange={(v) => setSettings({ ...settings, use_welcome_menu: v })}
            />
            <PermissionToggle
              label="Botões de Confirmação"
              description="Botões interativos para confirmar/remarcar/cancelar."
              checked={settings.use_confirmation_buttons}
              onChange={(v) => setSettings({ ...settings, use_confirmation_buttons: v })}
            />
            <PermissionToggle
              label="Lista de Horários"
              description="Horários disponíveis em lista selecionável."
              checked={settings.use_timeslot_list}
              onChange={(v) => setSettings({ ...settings, use_timeslot_list: v })}
            />
            <PermissionToggle
              label="Pesquisa de Satisfação"
              description="Enquete automática após consulta realizada."
              checked={settings.use_satisfaction_poll}
              onChange={(v) => setSettings({ ...settings, use_satisfaction_poll: v })}
            />
            <PermissionToggle
              label="Enviar Localização"
              description="Enviar mapa da clínica quando perguntarem o endereço."
              checked={settings.use_send_location}
              onChange={(v) => setSettings({ ...settings, use_send_location: v })}
            />
            {settings.use_send_location && (
              <div className="sm:col-span-2 flex items-start gap-2 p-3 rounded-lg bg-muted/20 border border-border">
                <MapPin size={16} className="shrink-0 mt-1 text-primary" />
                <div className="flex-1 space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Configure latitude e longitude da clínica nas configurações gerais da clínica.</p>
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
              Dentista via WhatsApp
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Permita que os dentistas interajam com a IA pelo WhatsApp para consultar agenda, cancelar e reagendar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PermissionToggle
              label="Ativar IA para Dentistas"
              description="Dentistas podem consultar agenda, cancelar e reagendar via WhatsApp."
              checked={settings.dentist_ai_enabled}
              onChange={(v) => setSettings({ ...settings, dentist_ai_enabled: v })}
            />
            {settings.dentist_ai_enabled && (
              <div className="flex items-start gap-2 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <Info size={14} className="shrink-0 mt-0.5 text-blue-500" />
                <div>
                  <p><strong>Como funciona:</strong> O dentista envia mensagem pelo WhatsApp e a IA reconhece automaticamente pelo número cadastrado. Funcionalidades:</p>
                  <ul className="mt-1 space-y-0.5 list-disc list-inside">
                    <li>Consultar agenda do dia ou semana</li>
                    <li>Ver próximos pacientes</li>
                    <li>Cancelar consultas de pacientes</li>
                    <li>Reagendar consultas</li>
                  </ul>
                  <p className="mt-1 text-[10px] opacity-75">Os dentistas precisam ter o número de telefone cadastrado no sistema.</p>
                </div>
              </div>
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
            Salvar Todas as Configurações
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
