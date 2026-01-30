"use client"
import { useState, useEffect } from "react"
import { useClinic } from "@/hooks/useClinic"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageSquare, ShieldCheck, RefreshCcw, Smartphone, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export default function WhatsAppSettingsPage() {
  const { clinic, isLoading, updateClinic, testWhatsApp } = useClinic()
  
  const [instanceId, setInstanceId] = useState("")
  const [token, setToken] = useState("")
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('disconnected')
  const [isTesting, setIsTesting] = useState(false)

  const handleTestConnection = async () => {
    setIsTesting(true)
    setConnectionStatus('checking')
    try {
      const res = await testWhatsApp.mutateAsync()
      if (res?.connected) {
        setConnectionStatus('connected')
      } else {
        setConnectionStatus('disconnected')
      }
    } catch (error) {
      setConnectionStatus('disconnected')
    } finally {
      setIsTesting(false)
    }
  }

  // Carregar credenciais da clínica - SEM testar automaticamente
  useEffect(() => {
    if (clinic) {
      setInstanceId(clinic.z_api_instance || "")
      setToken(clinic.z_api_token || "")
    }
  }, [clinic])

  const handleSave = async () => {
    try {
      await updateClinic.mutateAsync({ z_api_instance: instanceId, z_api_token: token })
      toast.success("Credenciais salvas!")
      handleTestConnection()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao salvar")
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Configurações do WhatsApp</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Conecte sua clínica ao WhatsApp para automações e lembretes.</p>
      </div>

      <div className="grid gap-6">
        {/* Status Card */}
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  connectionStatus === 'connected' ? 'bg-success/10 text-success' : 
                  connectionStatus === 'checking' ? 'bg-yellow-100 text-yellow-600' : 'bg-muted text-muted-foreground'
                }`}>
                  {connectionStatus === 'connected' ? <Smartphone size={24} /> : <AlertCircle size={24} />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Status da Conexão</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {connectionStatus === 'connected' ? 'Sua instância do WhatsApp está ativa e conectada.' : 
                     connectionStatus === 'checking' ? 'Verificando conexão...' : 'WhatsApp não configurado ou desconectado.'}
                  </p>
                </div>
              </div>
              <Badge 
                variant={connectionStatus === 'connected' ? "green" : connectionStatus === 'checking' ? "yellow" : "gray"} 
                className="px-3 py-1"
              >
                {connectionStatus === 'connected' ? 'Conectado' : 
                 connectionStatus === 'checking' ? 'Verificando...' : 'Desconectado'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Form */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Credenciais Z-API</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">Insira os dados da sua instância do Z-API para habilitar o envio de mensagens.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Instance ID</label>
                <Input 
                  placeholder="Ex: 3B8C..." 
                  value={instanceId}
                  onChange={(e) => setInstanceId(e.target.value)}
                  className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Token</label>
                <Input 
                  type="password"
                  placeholder="Seu token de segurança" 
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
              <Button 
                onClick={handleSave} 
                disabled={updateClinic.isPending}
                className="flex-1 h-11"
              >
                {updateClinic.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                Salvar Configuração
              </Button>
              <Button 
                variant="outline" 
                onClick={handleTestConnection} 
                disabled={isTesting}
                className="flex-1 h-11 text-gray-700 dark:text-gray-300"
              >
                {isTesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
                Testar Conexão
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <div className="rounded-lg bg-sky-500/5 border border-sky-500/10 p-4">
          <div className="flex gap-3">
            <MessageSquare className="h-5 w-5 text-sky-600 shrink-0" />
            <div className="text-sm text-sky-900/80">
              <p className="font-semibold mb-1">Como obter essas credenciais?</p>
              <p>Acesse o painel do <a href="https://z-api.io" target="_blank" className="underline font-medium">Z-API</a>, crie uma instância e copie o Instance ID e o Token gerados para vincular sua conta do WhatsApp Business.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
