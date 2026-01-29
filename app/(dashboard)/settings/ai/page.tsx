"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Loader2, Bot, Sparkles, Save, Info } from "lucide-react"

export default function AISettingsPage() {
  const { data: session } = useSession()
  const { success, error: toastError } = useToast()
  const queryClient = useQueryClient()

  const [settings, setSettings] = useState({
    name: "Sofia",
    personality: "amigável",
    welcome_message: "Olá! Eu sou a Sofia, sua assistente virtual. Como posso ajudar hoje?",
    instructions: "Você é uma assistente de uma clínica odontológica de alto padrão. Seja educada e prestativa.",
    can_schedule: true,
    can_show_prices: true,
    can_cancel: false,
    can_reschedule: true,
    can_send_reminders: true
  })

  // Buscar configurações de IA da clínica
  const { data: remoteSettings, isLoading } = useQuery({
    queryKey: ["ai-settings", (session?.user as any)?.id],
    queryFn: async () => {
      const res = await api.get(`/clinics/${(session as any)?.user?.clinic_id}/ai-settings`)
      return res.data?.data
    },
    enabled: !!session
  })

  useEffect(() => {
    if (remoteSettings) {
      setSettings(prev => ({ ...prev, ...remoteSettings }))
    }
  }, [remoteSettings])

  const updateMutation = useMutation({
    mutationFn: async () => {
      await api.put(`/clinics/${(session as any)?.user?.clinic_id}/ai-settings`, settings)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-settings"] })
      success("Configurações da IA atualizadas!")
    },
    onError: () => toastError("Erro ao salvar configurações da IA")
  })

  if (isLoading) {
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
          <Sparkles size={14} />
          IA Ativa
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
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  placeholder="Ex: Sofia"
                  className="bg-muted/30 border-none h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Personalidade</label>
                <select 
                  className="w-full h-11 rounded-md border-none bg-muted/30 px-3 text-sm focus:ring-2 focus:ring-primary/20"
                  value={settings.personality}
                  onChange={(e) => setSettings({ ...settings, personality: e.target.value })}
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
              checked={settings.can_schedule}
              onChange={(v) => setSettings({ ...settings, can_schedule: v })}
            />
            <PermissionToggle 
              label="Mostrar Preços" 
              description="A IA pode informar valores de procedimentos."
              checked={settings.can_show_prices}
              onChange={(v) => setSettings({ ...settings, can_show_prices: v })}
            />
            <PermissionToggle 
              label="Reagendar Consultas" 
              description="Permitir alteração de horários existentes."
              checked={settings.can_reschedule}
              onChange={(v) => setSettings({ ...settings, can_reschedule: v })}
            />
            <PermissionToggle 
              label="Enviar Lembretes" 
              description="Automatizar avisos de consultas próximas."
              checked={settings.can_send_reminders}
              onChange={(v) => setSettings({ ...settings, can_send_reminders: v })}
            />
            <PermissionToggle 
              label="Cancelar Consultas" 
              description="Permitir cancelamentos via chat."
              checked={settings.can_cancel}
              onChange={(v) => setSettings({ ...settings, can_cancel: v })}
            />
          </CardContent>
        </Card>

        {/* Instruções Customizadas */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Instruções Avançadas</CardTitle>
            <CardDescription>Dê diretrizes específicas sobre o atendimento da sua clínica.</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea 
              className="flex min-h-[150px] w-full rounded-md border-none bg-muted/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={settings.instructions}
              onChange={(e) => setSettings({ ...settings, instructions: e.target.value })}
              placeholder="Ex: 'Sempre mencione que temos estacionamento gratuito.' ou 'Priorize agendamentos para o período da manhã.'"
            />
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
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={18} />}
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
