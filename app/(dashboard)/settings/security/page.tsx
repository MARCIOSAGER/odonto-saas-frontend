"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ShieldCheck, Smartphone, Key, Loader2, Lock, QrCode } from "lucide-react"
import {
  useTwoFactorStatus,
  useSetupWhatsApp2fa,
  useSetupTotp,
  useVerifyTotpSetup,
  useDisable2fa,
} from "@/hooks/useTwoFactor"

export default function SecuritySettingsPage() {
  const { data: status, isLoading } = useTwoFactorStatus()
  const setupWhatsApp = useSetupWhatsApp2fa()
  const setupTotp = useSetupTotp()
  const verifyTotp = useVerifyTotpSetup()
  const disable2fa = useDisable2fa()

  // WhatsApp setup
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false)
  const [whatsAppPhone, setWhatsAppPhone] = useState("")

  // TOTP setup
  const [showTotpDialog, setShowTotpDialog] = useState(false)
  const [totpData, setTotpData] = useState<{ secret: string; qrCode: string } | null>(null)
  const [totpCode, setTotpCode] = useState("")

  // Disable
  const [showDisableDialog, setShowDisableDialog] = useState(false)
  const [disablePassword, setDisablePassword] = useState("")

  const handleSetupWhatsApp = async () => {
    const clean = whatsAppPhone.replace(/\D/g, "")
    if (clean.length < 10) return
    await setupWhatsApp.mutateAsync(clean)
    setShowWhatsAppDialog(false)
    setWhatsAppPhone("")
  }

  const handleSetupTotp = async () => {
    const data = await setupTotp.mutateAsync()
    setTotpData(data)
    setShowTotpDialog(true)
  }

  const handleVerifyTotp = async () => {
    if (!totpData || totpCode.length < 6) return
    await verifyTotp.mutateAsync({ code: totpCode, secret: totpData.secret })
    setShowTotpDialog(false)
    setTotpData(null)
    setTotpCode("")
  }

  const handleDisable = async () => {
    if (!disablePassword) return
    await disable2fa.mutateAsync(disablePassword)
    setShowDisableDialog(false)
    setDisablePassword("")
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Segurança</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Gerencie a autenticação de dois fatores (2FA) da sua conta.
        </p>
      </div>

      {/* Status Card */}
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">
                  Autenticação de dois fatores
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {status?.enabled
                    ? `Ativo via ${status.method === "whatsapp" ? "WhatsApp" : "Google Authenticator"}`
                    : "Desativado - ative para maior segurança"}
                </p>
              </div>
            </div>
            <Badge variant={status?.enabled ? "green" : "yellow"}>
              {status?.enabled ? "Ativo" : "Inativo"}
            </Badge>
          </div>

          {status?.enabled && status?.phone && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 ml-16">
              Telefone: {status.phone}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Setup Options */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* WhatsApp 2FA */}
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">WhatsApp</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Receba o código via WhatsApp
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Um código de 6 dígitos será enviado para o seu WhatsApp a cada login.
            </p>
            <Button
              variant={status?.method === "whatsapp" ? "outline" : "default"}
              className="w-full"
              onClick={() => setShowWhatsAppDialog(true)}
              disabled={status?.method === "whatsapp"}
            >
              {status?.method === "whatsapp" ? "Ativo" : "Ativar WhatsApp 2FA"}
            </Button>
          </CardContent>
        </Card>

        {/* TOTP 2FA */}
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Key className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">App Autenticador</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Google Authenticator, Authy, etc.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Use um app autenticador para gerar códigos temporários.
            </p>
            <Button
              variant={status?.method === "totp" ? "outline" : "default"}
              className="w-full"
              onClick={handleSetupTotp}
              disabled={status?.method === "totp" || setupTotp.isPending}
            >
              {setupTotp.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {status?.method === "totp" ? "Ativo" : "Ativar App Autenticador"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Disable Button */}
      {status?.enabled && (
        <Card className="border-red-200 dark:border-red-900 bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Desativar 2FA</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Remover a proteção de dois fatores da sua conta.
                </p>
              </div>
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={() => setShowDisableDialog(true)}
              >
                Desativar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* WhatsApp Setup Dialog */}
      <Dialog open={showWhatsAppDialog} onOpenChange={setShowWhatsAppDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              Ativar 2FA WhatsApp
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Informe o número do WhatsApp que receberá os códigos de verificação.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Número WhatsApp
              </label>
              <Input
                placeholder="5521999999999"
                value={whatsAppPhone}
                onChange={(e) => setWhatsAppPhone(e.target.value)}
                className="text-gray-900 dark:text-gray-100"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Com DDI + DDD + número (ex: 5521999999999)
              </p>
            </div>
            <Button
              className="w-full"
              onClick={handleSetupWhatsApp}
              disabled={setupWhatsApp.isPending || whatsAppPhone.replace(/\D/g, "").length < 10}
            >
              {setupWhatsApp.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Ativar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* TOTP Setup Dialog */}
      <Dialog open={showTotpDialog} onOpenChange={setShowTotpDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              Configurar App Autenticador
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Escaneie o QR code com o Google Authenticator ou Authy.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {totpData?.qrCode && (
              <div className="flex justify-center">
                <img src={totpData.qrCode} alt="QR Code TOTP" className="w-48 h-48 rounded-lg" />
              </div>
            )}
            {totpData?.secret && (
              <div className="space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Ou digite manualmente:
                </p>
                <p className="text-center font-mono text-sm bg-muted p-2 rounded select-all text-gray-900 dark:text-gray-100">
                  {totpData.secret}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Código de 6 dígitos
              </label>
              <Input
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="text-center text-lg font-mono tracking-widest text-gray-900 dark:text-gray-100"
                maxLength={6}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleVerifyTotp}
              disabled={verifyTotp.isPending || totpCode.length < 6}
            >
              {verifyTotp.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Verificar e ativar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Disable Dialog */}
      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              Desativar 2FA
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Para desativar, confirme sua senha atual.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Senha atual
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  className="pl-10 text-gray-900 dark:text-gray-100"
                  placeholder="Digite sua senha"
                />
              </div>
            </div>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDisable}
              disabled={disable2fa.isPending || !disablePassword}
            >
              {disable2fa.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Confirmar desativação
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
