"use client"
import { useState, useEffect } from "react"
import { useClinic } from "@/hooks/useClinic"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save, Bot, Sparkles, MessageSquare, ShieldCheck, Zap, Info } from "lucide-react"
import { toast } from "sonner"

export default function AISettingsPage() {
  const { aiSettings, isLoadingAI, updateAISettings } = useClinic()

  const [settings, setSettings] = useState({
    ai_enabled: true,
    assistant_name: "Sofia",
    assistant_personality: "amigável",
    welcome_message: "Olá! Eu sou a Sofia, sua assistente virtual. Como posso ajudar hoje?",
    fallback_message: "Desculpe, não entendi. Pode repetir?",
    auto_schedule: true,
    auto_confirm: true,
    auto_cancel: false,
    custom_instructions: "Você é uma assistente de uma clínica odontológica de alto padrão. Seja educada e prestativa.",
    transfer_keywords: "falar com humano, atendente, ajuda",
    blocked_topics: "política, religião, futebol"
  })

  useEffect(() => {
    if (aiSettings) {
      setSettings(prev => ({ ...prev, ...aiSettings }))
    }
  }, [aiSettings])

  const handleSave = async () => {
    try {
      await updateAISettings.mutateAsync(settings)
      toast.success("Configurações de IA salvas!")
    } catch (error) {
      toast.error("Erro ao salvar configurações de IA")
    }
  }

  if (isLoadingAI) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Assistente de IA</h1>
          <p className="text-sm text-muted-foreground">Personalize como sua assistente virtual interage com os pacientes.</p>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
          <Switch 
            checked={settings.ai_enabled} 
            onCheckedChange={(v) => setSettings({ ...settings, ai_enabled: v })} 
            className="scale-75"
          />
          {settings.ai_enabled ? "IA Ativa" : "IA Inativa"}
        </div>
      </div>

      <div className="grid gap-6">
        {/* Identidade */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot size={20} className="text-primary" />
              Identidade e Personalidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Nome da Assistente</label>
                <Input 
                  value={settings.assistant_name}
                  onChange={(e) => setSettings({ ...settings, assistant_name: e.target.value })}
                  placeholder="Ex: Sofia"
                  className="bg-muted/30 border-none h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Personalidade</label>
                <select 
                  className="w-full h-11 rounded-md border-none bg-muted/30 px-3 text-sm focus:ring-2 focus:ring-primary/20"
                  value={settings.assistant_personality}
                  onChange={(e) => setSettings({ ...settings, assistant_personality: e.target.value })}
                >
                  <option value="formal">Formal e Profissional</option>
                  <option value="amigável">Amigável e Acolhedora</option>
                  <option value="casual">Casual e Direta</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Mensagem de Boas-vindas</label>
              <textarea 
                className="flex min-h-[100px] w-full rounded-md border-none bg-muted/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={settings.welcome_message}
                onChange={(e) => setSettings({ ...settings, welcome_message: e.target.value })}
                placeholder="Mensagem que a IA envia no início da conversa..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Permissões */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Capacidades e Permissões</CardTitle>
            <CardDescription>Defina o que a IA tem autonomia para fazer no sistema.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
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
          </CardContent>
        </Card>

        {/* Instruções Customizadas */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Instruções Avançadas</CardTitle>
            <CardDescription>Dê diretrizes específicas sobre o atendimento da sua clínica.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Instruções Customizadas</label>
              <textarea 
                className="flex min-h-[120px] w-full rounded-md border-none bg-muted/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={settings.custom_instructions}
                onChange={(e) => setSettings({ ...settings, custom_instructions: e.target.value })}
                placeholder="Ex: 'Sempre mencione que temos estacionamento gratuito.' ou 'Priorize agendamentos para o período da manhã.'"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Palavras-chave de Transferência</label>
                <Input 
                  value={settings.transfer_keywords}
                  onChange={(e) => setSettings({ ...settings, transfer_keywords: e.target.value })}
                  placeholder="humano, atendente, ajuda"
                  className="bg-muted/30 border-none h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Tópicos Bloqueados</label>
                <Input 
                  value={settings.blocked_topics}
                  onChange={(e) => setSettings({ ...settings, blocked_topics: e.target.value })}
                  placeholder="política, religião"
                  className="bg-muted/30 border-none h-11"
                />
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg">
              <Info size={14} className="shrink-0 mt-0.5" />
              <p>Essas instruções ajudam a IA a entender o contexto específico do seu consultório e agir de acordo com seus processos internos.</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button 
            size="lg" 
            className="w-full sm:w-auto px-12 gap-2"
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
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
