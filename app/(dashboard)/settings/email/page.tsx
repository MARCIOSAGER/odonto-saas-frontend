"use client"
import { useState, useEffect } from "react"
import { useClinic } from "@/hooks/useClinic"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Loader2, Save, Eye, EyeOff, CheckCircle, XCircle,
  Send, Info, Server, Mail
} from "lucide-react"

export default function EmailSettingsPage() {
  const { emailSettings, isLoadingEmail, updateEmailSettings, testEmail } = useClinic()

  const [form, setForm] = useState({
    smtp_host: "",
    smtp_port: 465,
    smtp_user: "",
    smtp_pass: "",
    smtp_from: "",
    smtp_secure: true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    if (emailSettings) {
      setForm(prev => ({
        ...prev,
        smtp_host: emailSettings.smtp_host || "",
        smtp_port: emailSettings.smtp_port || 465,
        smtp_user: emailSettings.smtp_user || "",
        smtp_pass: "",
        smtp_from: emailSettings.smtp_from || "",
        smtp_secure: emailSettings.smtp_secure ?? true,
      }))
    }
  }, [emailSettings])

  const handleSave = async () => {
    const payload: any = { ...form }
    if (!payload.smtp_pass) delete payload.smtp_pass
    if (payload.smtp_port) payload.smtp_port = Number(payload.smtp_port)
    await updateEmailSettings.mutateAsync(payload)
  }

  const handleTest = async () => {
    setTestResult(null)
    try {
      const payload: any = { ...form }
      if (!payload.smtp_pass) delete payload.smtp_pass
      if (payload.smtp_port) payload.smtp_port = Number(payload.smtp_port)
      await updateEmailSettings.mutateAsync(payload)
      const result = await testEmail.mutateAsync()
      setTestResult(result)
    } catch {
      setTestResult({ success: false, message: "Erro ao testar e-mail" })
    }
  }

  if (isLoadingEmail) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações de E-mail</h1>
        <p className="text-muted-foreground">Configure o servidor SMTP para envio de e-mails da clínica.</p>
      </div>

      {/* SMTP Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Servidor SMTP
          </CardTitle>
          <CardDescription>
            Configure as credenciais do servidor de e-mail para envio de notificações, lembretes e recuperação de senha.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Servidor SMTP</label>
              <Input
                placeholder="smtp.gmail.com"
                value={form.smtp_host}
                onChange={(e) => setForm({ ...form, smtp_host: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Porta</label>
              <Input
                type="number"
                placeholder="465"
                value={form.smtp_port}
                onChange={(e) => setForm({ ...form, smtp_port: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Usuário / E-mail</label>
              <Input
                placeholder="seu-email@provedor.com"
                value={form.smtp_user}
                onChange={(e) => setForm({ ...form, smtp_user: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Senha</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={emailSettings?.smtp_pass_set ? "Senha configurada (********)" : "Senha SMTP"}
                  value={form.smtp_pass}
                  onChange={(e) => setForm({ ...form, smtp_pass: e.target.value })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">E-mail Remetente (From)</label>
            <Input
              placeholder="Clínica Odonto <noreply@suaclinica.com>"
              value={form.smtp_from}
              onChange={(e) => setForm({ ...form, smtp_from: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Formato: Nome &lt;email@dominio.com&gt; ou apenas email@dominio.com
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={form.smtp_secure}
              onCheckedChange={(checked) => setForm({ ...form, smtp_secure: checked })}
            />
            <label className="text-sm font-medium">Usar SSL/TLS (recomendado para porta 465)</label>
          </div>

          <Button
            onClick={handleSave}
            disabled={updateEmailSettings.isPending}
            className="w-full sm:w-auto"
          >
            {updateEmailSettings.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>

      {/* Test Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Testar Envio
          </CardTitle>
          <CardDescription>
            Salva as configurações e envia um e-mail de teste para o seu endereço cadastrado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleTest}
            disabled={testEmail.isPending || updateEmailSettings.isPending}
            variant="outline"
          >
            {testEmail.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            Enviar E-mail de Teste
          </Button>

          {testResult && (
            <div className={`flex items-center gap-2 p-3 rounded-md text-sm font-medium ${
              testResult.success
                ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
            }`}>
              {testResult.success ? (
                <CheckCircle className="h-4 w-4 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0" />
              )}
              {testResult.message}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-3 text-sm">
              <p className="font-medium text-foreground">Provedores SMTP comuns:</p>
              <div className="grid gap-2 text-muted-foreground">
                <div><strong>Gmail:</strong> smtp.gmail.com, porta 465 (SSL) - requer Senha de App</div>
                <div><strong>Outlook:</strong> smtp.office365.com, porta 587 (desativar SSL)</div>
                <div><strong>Hostinger:</strong> smtp.hostinger.com, porta 465 (SSL)</div>
                <div><strong>Zoho:</strong> smtp.zoho.com, porta 465 (SSL)</div>
              </div>
              <p className="text-xs text-muted-foreground">
                Se nenhum SMTP for configurado, o sistema usará as configurações padrão do servidor.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
