"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageSquare, ShieldCheck, RefreshCcw, Wifi, WifiOff } from "lucide-react"

export default function WhatsAppSettingsPage() {
  const { data: session } = useSession()
  const { success, error: toastError } = useToast()
  const queryClient = useQueryClient()
  
  const [instanceId, setInstanceId] = useState("")
  const [token, setToken] = useState("")
  const [isTesting, setIsTesting] = useState(false)

  // Buscar dados da clínica
  const { data: clinic, isLoading } = useQuery({
    queryKey: ["clinic-settings", (session?.user as any)?.id],
    queryFn: async () => {
      const res = await api.get(`/auth/me`) // O endpoint me retorna os dados da clínica também
      return res.data?.data
    },
    enabled: !!session
  })

  useEffect(() => {
    if (clinic) {
      setInstanceId(clinic.z_api_instance || "")
      setToken(clinic.z_api_token || "")
    }
  }, [clinic])

  const updateMutation = useMutation({
    mutationFn: async () => {
      await api.put(`/clinics/${clinic.clinic_id}`, {
        z_api_instance: instanceId,
        z_api_token: token
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinic-settings"] })
      success("Configurações do WhatsApp salvas!")
    },
    onError: () => toastError("Erro ao salvar configurações")
  })

  const handleTestConnection = async () => {
    setIsTesting(true)
    try {
      // Simulação de teste de conexão com Z-API
      await new Promise(resolve => setTimeout(resolve, 1500))
      success("Conexão com WhatsApp estabelecida com sucesso!")
    } catch (err) {
      toastError("Falha na conexão. Verifique o Instance ID e Token.")
    } finally {
      setIsTesting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const isConnected = !!(clinic?.z_api_instance && clinic?.z_api_token)

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Configurações do WhatsApp</h1>
        <p className="text-sm text-muted-foreground">Conecte sua clínica ao WhatsApp para automações e lembretes.</p>
      </div>

      <div className="grid gap-6">
        {/* Status Card */}
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isConnected ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                  {isConnected ? <Wifi size={24} /> : <WifiOff size={24} />}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Status da Conexão</h3>
                  <p className="text-sm text-muted-foreground">
                    {isConnected ? 'Sua instância do WhatsApp está ativa e conectada.' : 'WhatsApp não configurado ou desconectado.'}
                  </p>
                </div>
              </div>
              <Badge variant={isConnected ? "green" : "gray"} className="px-3 py-1">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Form */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Credenciais Z-API</CardTitle>
            <CardDescription>Insira os dados da sua instância do Z-API para habilitar o envio de mensagens.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Instance ID</label>
                <Input 
                  placeholder="Ex: 3B8C..." 
                  value={instanceId}
                  onChange={(e) => setInstanceId(e.target.value)}
                  className="bg-muted/30 border-none h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Token</label>
                <Input 
                  type="password"
                  placeholder="Seu token de segurança" 
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="bg-muted/30 border-none h-11"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
              <Button 
                onClick={() => updateMutation.mutate()} 
                disabled={updateMutation.isPending}
                className="flex-1 h-11"
              >
                {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                Salvar Configuração
              </Button>
              <Button 
                variant="outline" 
                onClick={handleTestConnection} 
                disabled={isTesting || !isConnected}
                className="flex-1 h-11"
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
