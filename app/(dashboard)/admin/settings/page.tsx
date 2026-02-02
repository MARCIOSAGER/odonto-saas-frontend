"use client"
import { useEffect, useState, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { toast } from "sonner"
import {
  Loader2,
  Save,
  CreditCard,
  Mail,
  Globe,
  Eye,
  EyeOff,
  Settings2,
} from "lucide-react"

interface ConfigItem {
  id: string
  key: string
  value: string
  type: string
  description: string | null
  is_public: boolean
  is_editable: boolean
  category: string
}

export default function AdminSettingsPage() {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  // Payment gateway state
  const [gatewayConfigs, setGatewayConfigs] = useState<Record<string, string>>({})
  // SMTP state
  const [smtpConfigs, setSmtpConfigs] = useState<Record<string, string>>({})
  // General state
  const [generalConfigs, setGeneralConfigs] = useState<Record<string, string>>({})

  // Visibility toggles for sensitive fields
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({})

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [gatewayRes, smtpRes, generalRes] = await Promise.all([
        api.get("/system-config/category/payment_gateway"),
        api.get("/system-config/category/smtp"),
        api.get("/system-config/category/general"),
      ])

      const toMap = (data: any): Record<string, string> => {
        const items: ConfigItem[] = data?.data?.data || data?.data || []
        const map: Record<string, string> = {}
        if (Array.isArray(items)) {
          items.forEach((item) => { map[item.key] = item.value })
        }
        return map
      }

      setGatewayConfigs(toMap(gatewayRes))
      setSmtpConfigs(toMap(smtpRes))
      setGeneralConfigs(toMap(generalRes))
    } catch {
      toast.error("Erro ao carregar configurações")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const toggleVisibility = (field: string) => {
    setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  async function saveCategory(category: string, configs: Record<string, string>) {
    setSaving(category)
    try {
      const payload = Object.entries(configs).map(([key, value]) => ({ key, value }))
      await api.put("/system-config/bulk", { configs: payload })
      await queryClient.invalidateQueries({ queryKey: ["platform-branding"] })
      toast.success("Configurações salvas com sucesso!")
    } catch {
      toast.error("Erro ao salvar configurações")
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const activeGateway = gatewayConfigs.payment_gateway_active || "none"

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Settings2 className="h-6 w-6" /> Configurações da Plataforma
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie gateways de pagamento, SMTP e configurações gerais.
        </p>
      </div>

      {/* ========== PAYMENT GATEWAY ========== */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <CardTitle>Gateway de Pagamento</CardTitle>
                <CardDescription>Configure Stripe ou Asaas para cobranças.</CardDescription>
              </div>
            </div>
            <Badge variant={activeGateway !== "none" ? "default" : "secondary"}>
              {activeGateway === "none" ? "Nenhum" : activeGateway === "stripe" ? "Stripe" : "Asaas"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Gateway selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Gateway ativo</label>
            <div className="flex gap-2">
              {["none", "stripe", "asaas"].map((gw) => (
                <Button
                  key={gw}
                  variant={activeGateway === gw ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGatewayConfigs((p) => ({ ...p, payment_gateway_active: gw }))}
                >
                  {gw === "none" ? "Nenhum" : gw === "stripe" ? "Stripe" : "Asaas"}
                </Button>
              ))}
            </div>
          </div>

          {/* Stripe settings */}
          {(activeGateway === "stripe" || activeGateway === "none") && (
            <div className="space-y-4 rounded-lg border border-border p-4">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>
                Stripe
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Secret Key</label>
                  <div className="relative">
                    <Input
                      type={visibleFields.stripe_secret_key ? "text" : "password"}
                      value={gatewayConfigs.stripe_secret_key || ""}
                      onChange={(e) => setGatewayConfigs((p) => ({ ...p, stripe_secret_key: e.target.value }))}
                      placeholder="sk_live_..."
                    />
                    <button
                      type="button"
                      onClick={() => toggleVisibility("stripe_secret_key")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {visibleFields.stripe_secret_key ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Publishable Key</label>
                  <Input
                    value={gatewayConfigs.stripe_publishable_key || ""}
                    onChange={(e) => setGatewayConfigs((p) => ({ ...p, stripe_publishable_key: e.target.value }))}
                    placeholder="pk_live_..."
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">Webhook Secret</label>
                  <div className="relative">
                    <Input
                      type={visibleFields.stripe_webhook_secret ? "text" : "password"}
                      value={gatewayConfigs.stripe_webhook_secret || ""}
                      onChange={(e) => setGatewayConfigs((p) => ({ ...p, stripe_webhook_secret: e.target.value }))}
                      placeholder="whsec_..."
                    />
                    <button
                      type="button"
                      onClick={() => toggleVisibility("stripe_webhook_secret")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {visibleFields.stripe_webhook_secret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Asaas settings */}
          {(activeGateway === "asaas" || activeGateway === "none") && (
            <div className="space-y-4 rounded-lg border border-border p-4">
              <h4 className="text-sm font-semibold">Asaas</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">API Key</label>
                  <div className="relative">
                    <Input
                      type={visibleFields.asaas_api_key ? "text" : "password"}
                      value={gatewayConfigs.asaas_api_key || ""}
                      onChange={(e) => setGatewayConfigs((p) => ({ ...p, asaas_api_key: e.target.value }))}
                      placeholder="$aact_..."
                    />
                    <button
                      type="button"
                      onClick={() => toggleVisibility("asaas_api_key")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {visibleFields.asaas_api_key ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Webhook Token</label>
                  <div className="relative">
                    <Input
                      type={visibleFields.asaas_webhook_token ? "text" : "password"}
                      value={gatewayConfigs.asaas_webhook_token || ""}
                      onChange={(e) => setGatewayConfigs((p) => ({ ...p, asaas_webhook_token: e.target.value }))}
                      placeholder="Token do webhook"
                    />
                    <button
                      type="button"
                      onClick={() => toggleVisibility("asaas_webhook_token")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {visibleFields.asaas_webhook_token ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:col-span-2 rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Modo Sandbox</p>
                    <p className="text-xs text-muted-foreground">Usar ambiente de testes do Asaas</p>
                  </div>
                  <Switch
                    checked={gatewayConfigs.asaas_sandbox === "true"}
                    onCheckedChange={(checked) => setGatewayConfigs((p) => ({ ...p, asaas_sandbox: String(checked) }))}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={() => saveCategory("payment_gateway", gatewayConfigs)} disabled={saving === "payment_gateway"}>
              {saving === "payment_gateway" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Salvar gateway
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ========== SMTP ========== */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>SMTP Padrão</CardTitle>
              <CardDescription>Servidor de e-mail padrão para clínicas sem SMTP próprio.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Host SMTP</label>
              <Input
                value={smtpConfigs.smtp_default_host || ""}
                onChange={(e) => setSmtpConfigs((p) => ({ ...p, smtp_default_host: e.target.value }))}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Porta</label>
              <Input
                value={smtpConfigs.smtp_default_port || ""}
                onChange={(e) => setSmtpConfigs((p) => ({ ...p, smtp_default_port: e.target.value }))}
                placeholder="587"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Usuário</label>
              <Input
                value={smtpConfigs.smtp_default_user || ""}
                onChange={(e) => setSmtpConfigs((p) => ({ ...p, smtp_default_user: e.target.value }))}
                placeholder="noreply@seudominio.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Senha</label>
              <div className="relative">
                <Input
                  type={visibleFields.smtp_default_pass ? "text" : "password"}
                  value={smtpConfigs.smtp_default_pass || ""}
                  onChange={(e) => setSmtpConfigs((p) => ({ ...p, smtp_default_pass: e.target.value }))}
                  placeholder="Senha do SMTP"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility("smtp_default_pass")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {visibleFields.smtp_default_pass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-foreground">E-mail remetente (From)</label>
              <Input
                value={smtpConfigs.smtp_default_from || ""}
                onChange={(e) => setSmtpConfigs((p) => ({ ...p, smtp_default_from: e.target.value }))}
                placeholder="noreply@seudominio.com"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => saveCategory("smtp", smtpConfigs)} disabled={saving === "smtp"}>
              {saving === "smtp" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Salvar SMTP
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ========== GENERAL ========== */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <Globe className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Contatos de suporte e links institucionais.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">E-mail de suporte</label>
              <Input
                value={generalConfigs.platform_support_email || ""}
                onChange={(e) => setGeneralConfigs((p) => ({ ...p, platform_support_email: e.target.value }))}
                placeholder="suporte@seudominio.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">WhatsApp de suporte</label>
              <Input
                value={generalConfigs.platform_support_whatsapp || ""}
                onChange={(e) => setGeneralConfigs((p) => ({ ...p, platform_support_whatsapp: e.target.value }))}
                placeholder="5511999999999"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">URL Termos de uso</label>
              <Input
                value={generalConfigs.platform_terms_url || ""}
                onChange={(e) => setGeneralConfigs((p) => ({ ...p, platform_terms_url: e.target.value }))}
                placeholder="https://seudominio.com/termos"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">URL Política de privacidade</label>
              <Input
                value={generalConfigs.platform_privacy_url || ""}
                onChange={(e) => setGeneralConfigs((p) => ({ ...p, platform_privacy_url: e.target.value }))}
                placeholder="https://seudominio.com/privacidade"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => saveCategory("general", generalConfigs)} disabled={saving === "general"}>
              {saving === "general" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Salvar geral
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
