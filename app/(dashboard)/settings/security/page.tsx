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
import { useTranslations } from "next-intl"

export default function SecuritySettingsPage() {
  const t = useTranslations("security")
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
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{t("title")}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("subtitle")}
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
                  {t("twoFactorAuth")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {status?.enabled
                    ? t("activeVia", { method: status.method === "whatsapp" ? t("methodWhatsapp") : t("methodTotp") })
                    : t("inactive2fa")}
                </p>
              </div>
            </div>
            <Badge variant={status?.enabled ? "green" : "yellow"}>
              {status?.enabled ? t("active") : t("inactiveLabel")}
            </Badge>
          </div>

          {status?.enabled && status?.phone && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 ml-16">
              {t("phone", { phone: status.phone })}
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
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{t("whatsapp")}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("receiveViaWhatsapp")}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t("whatsappDescription")}
            </p>
            <Button
              variant={status?.method === "whatsapp" ? "outline" : "default"}
              className="w-full"
              onClick={() => setShowWhatsAppDialog(true)}
              disabled={status?.method === "whatsapp"}
            >
              {status?.method === "whatsapp" ? t("active") : t("activateWhatsapp")}
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
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{t("authenticatorApp")}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("authenticatorApps")}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t("authenticatorDescription")}
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
              {status?.method === "totp" ? t("active") : t("activateTotp")}
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
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{t("disable2fa")}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("disableDescription")}
                </p>
              </div>
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={() => setShowDisableDialog(true)}
              >
                {t("disable")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* WhatsApp Setup Dialog */}
      <Dialog open={showWhatsAppDialog} onOpenChange={setShowWhatsAppDialog}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-green-500 to-green-600 px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-white/20 flex items-center justify-center">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-white text-lg font-bold">
                  {t("setupWhatsappTitle")}
                </DialogTitle>
                <p className="text-green-100 text-sm mt-0.5">
                  {t("setupWhatsappSubtitle")}
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t("whatsappNumber")}
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="5521999999999"
                  value={whatsAppPhone}
                  onChange={(e) => setWhatsAppPhone(e.target.value.replace(/\D/g, ""))}
                  className="pl-10 h-11 text-gray-900 dark:text-gray-100 font-mono"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("phoneFormat")}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-3">
              <p className="text-xs text-green-700 dark:text-green-400">
                {t("whatsappLoginNote")}
              </p>
            </div>
            <Button
              className="w-full h-11 bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSetupWhatsApp}
              disabled={setupWhatsApp.isPending || whatsAppPhone.replace(/\D/g, "").length < 10}
            >
              {setupWhatsApp.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ShieldCheck className="h-4 w-4 mr-2" />
              )}
              {t("activateWhatsapp")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* TOTP Setup Dialog */}
      <Dialog open={showTotpDialog} onOpenChange={setShowTotpDialog}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-white/20 flex items-center justify-center">
                <QrCode className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-white text-lg font-bold">
                  {t("setupTotpTitle")}
                </DialogTitle>
                <p className="text-purple-100 text-sm mt-0.5">
                  {t("setupTotpSubtitle")}
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5 space-y-5">
            {totpData?.qrCode && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 text-xs font-bold">1</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{t("scanQrCode")}</span>
                </div>
                <div className="flex justify-center py-2">
                  <div className="p-3 bg-white rounded-xl shadow-sm border">
                    <img src={totpData.qrCode} alt="QR Code TOTP" className="w-44 h-44" />
                  </div>
                </div>
              </div>
            )}

            {totpData?.secret && (
              <div className="space-y-1.5">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {t("manualEntry")}
                </p>
                <div className="bg-muted rounded-lg p-2.5 border border-border">
                  <p className="text-center font-mono text-sm tracking-wider select-all text-gray-900 dark:text-gray-100 break-all">
                    {totpData.secret}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 text-xs font-bold">2</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{t("enterCode")}</span>
              </div>
              <Input
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="text-center text-2xl font-mono tracking-[0.4em] h-12 text-gray-900 dark:text-gray-100"
                maxLength={6}
              />
            </div>

            <Button
              className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleVerifyTotp}
              disabled={verifyTotp.isPending || totpCode.length < 6}
            >
              {verifyTotp.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ShieldCheck className="h-4 w-4 mr-2" />
              )}
              {t("verifyAndActivate")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Disable Dialog */}
      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-red-500 to-red-600 px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-white/20 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-white text-lg font-bold">
                  {t("disableTitle")}
                </DialogTitle>
                <p className="text-red-100 text-sm mt-0.5">
                  {t("disableWarning")}
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3">
              <p className="text-xs text-red-700 dark:text-red-400">
                {t("disableExplanation")}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t("confirmPassword")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  className="pl-10 h-11 text-gray-900 dark:text-gray-100"
                  placeholder={t("currentPassword")}
                />
              </div>
            </div>
            <Button
              variant="destructive"
              className="w-full h-11"
              onClick={handleDisable}
              disabled={disable2fa.isPending || !disablePassword}
            >
              {disable2fa.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Lock className="h-4 w-4 mr-2" />
              )}
              {t("confirmDisable")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
