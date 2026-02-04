"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { useClinic } from "@/hooks/useClinic"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageSquare, ShieldCheck, RefreshCcw, Smartphone, AlertCircle, QrCode, Send, Power, RotateCcw, Unplug } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { useTranslations } from "next-intl"

export default function WhatsAppSettingsPage() {
  const t = useTranslations("whatsappSettings")
  const { clinic, isLoading, updateClinic, testWhatsApp, getQrCode, sendTestMessage, disconnectWhatsApp, restartWhatsApp, restoreWhatsApp } = useClinic()

  const [instanceId, setInstanceId] = useState("")
  const [token, setToken] = useState("")
  const [clientToken, setClientToken] = useState("")
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const [isTesting, setIsTesting] = useState(false)

  // QR Code state
  const [qrCodeData, setQrCodeData] = useState<string | null>(null)
  const [isLoadingQr, setIsLoadingQr] = useState(false)
  const qrIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const qrAttemptsRef = useRef(0)

  // Test message state
  const [testPhone, setTestPhone] = useState("")
  const [isSendingTest, setIsSendingTest] = useState(false)

  const statusIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const checkStatusSilently = useCallback(async () => {
    try {
      const res = await api.post("/clinics/my/test-whatsapp")
      const data = res.data?.data || res.data
      if (data?.connected) {
        setConnectionStatus('connected')
      } else {
        setConnectionStatus('disconnected')
      }
    } catch {
      setConnectionStatus('disconnected')
    }
  }, [])

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

  useEffect(() => {
    if (clinic) {
      setInstanceId(clinic.z_api_instance || "")
      setToken(clinic.z_api_token || "")
      setClientToken(clinic.z_api_client_token || "")

      if (clinic.z_api_instance && clinic.z_api_token) {
        checkStatusSilently()
      } else {
        setConnectionStatus('disconnected')
      }
    }
  }, [clinic, checkStatusSilently])

  useEffect(() => {
    if (!clinic?.z_api_instance || !clinic?.z_api_token) return

    statusIntervalRef.current = setInterval(() => {
      checkStatusSilently()
    }, 30000)

    return () => {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current)
      }
    }
  }, [clinic?.z_api_instance, clinic?.z_api_token, checkStatusSilently])

  useEffect(() => {
    return () => {
      if (qrIntervalRef.current) clearInterval(qrIntervalRef.current)
      if (statusIntervalRef.current) clearInterval(statusIntervalRef.current)
    }
  }, [])

  const handleSave = async () => {
    try {
      await updateClinic.mutateAsync({ z_api_instance: instanceId, z_api_token: token, z_api_client_token: clientToken })
      toast.success(t("credentialsSaved"))
      handleTestConnection()
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("saveError"))
    }
  }

  const fetchQrCode = useCallback(async () => {
    try {
      const res = await getQrCode.mutateAsync()
      if (res?.success && res?.qrcode) {
        const qrValue = typeof res.qrcode === 'string' ? res.qrcode : res.qrcode?.value || ''
        if (qrValue) {
          const imgSrc = qrValue.startsWith('data:') || qrValue.startsWith('http')
            ? qrValue
            : `data:image/png;base64,${qrValue}`
          setQrCodeData(imgSrc)
          qrAttemptsRef.current = 0
        }
      } else {
        qrAttemptsRef.current++
        if (qrAttemptsRef.current >= 3) {
          stopQrPolling()
          toast.error(t("qrCodeFailed"))
        }
      }
    } catch (error) {
      qrAttemptsRef.current++
      if (qrAttemptsRef.current >= 3) {
        stopQrPolling()
      }
    }
  }, [getQrCode])

  const startQrPolling = () => {
    setIsLoadingQr(true)
    qrAttemptsRef.current = 0
    fetchQrCode()
    qrIntervalRef.current = setInterval(async () => {
      try {
        const res = await api.post("/clinics/my/test-whatsapp")
        const data = res.data?.data || res.data
        if (data?.connected) {
          stopQrPolling()
          setConnectionStatus('connected')
          toast.success(t("connected"))
          return
        }
      } catch {}
      fetchQrCode()
    }, 15000)
  }

  const stopQrPolling = () => {
    if (qrIntervalRef.current) {
      clearInterval(qrIntervalRef.current)
      qrIntervalRef.current = null
    }
    setIsLoadingQr(false)
    setQrCodeData(null)
  }

  const handleSendTestMessage = async () => {
    if (!testPhone.trim()) {
      toast.error(t("phoneRequired"))
      return
    }
    setIsSendingTest(true)
    try {
      await sendTestMessage.mutateAsync(testPhone)
    } catch (error) {
      // Error handled by mutation
    } finally {
      setIsSendingTest(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnectWhatsApp.mutateAsync()
      setConnectionStatus('disconnected')
    } catch {}
  }

  const handleRestart = async () => {
    setConnectionStatus('checking')
    try {
      await restartWhatsApp.mutateAsync()
      setTimeout(() => checkStatusSilently(), 3000)
    } catch {
      setConnectionStatus('disconnected')
    }
  }

  const handleRestore = async () => {
    setConnectionStatus('checking')
    try {
      await restoreWhatsApp.mutateAsync()
      setTimeout(() => checkStatusSilently(), 3000)
    } catch {
      setConnectionStatus('disconnected')
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
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{t("title")}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("subtitle")}</p>
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
                  {connectionStatus === 'connected' ? <Smartphone size={24} /> :
                   connectionStatus === 'checking' ? <Loader2 size={24} className="animate-spin" /> : <AlertCircle size={24} />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t("connectionStatus")}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {connectionStatus === 'connected' ? t("statusConnected") :
                     connectionStatus === 'checking' ? t("statusChecking") : t("statusDisconnected")}
                  </p>
                </div>
              </div>
              <Badge
                variant={connectionStatus === 'connected' ? "green" : connectionStatus === 'checking' ? "yellow" : "gray"}
                className="px-3 py-1"
              >
                {connectionStatus === 'connected' ? t("badgeConnected") :
                 connectionStatus === 'checking' ? t("badgeChecking") : t("badgeDisconnected")}
              </Badge>
            </div>

            {instanceId && token && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="gap-2 text-gray-700 dark:text-gray-300"
                >
                  {isTesting ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCcw size={14} />}
                  {t("testConnection")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRestart}
                  disabled={restartWhatsApp.isPending}
                  className="gap-2 text-gray-700 dark:text-gray-300"
                >
                  {restartWhatsApp.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw size={14} />}
                  {t("restart")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRestore}
                  disabled={restoreWhatsApp.isPending}
                  className="gap-2 text-gray-700 dark:text-gray-300"
                >
                  {restoreWhatsApp.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Power size={14} />}
                  {t("restoreSession")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  disabled={disconnectWhatsApp.isPending || connectionStatus !== 'connected'}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  {disconnectWhatsApp.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Unplug size={14} />}
                  {t("disconnect")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configuration Form */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{t("zapiCredentials")}</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">{t("zapiCredentialsDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("instanceId")}</label>
                <Input
                  placeholder={t("instanceIdPlaceholder")}
                  value={instanceId}
                  onChange={(e) => setInstanceId(e.target.value)}
                  className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("instanceToken")}</label>
                <Input
                  type="password"
                  placeholder={t("instanceTokenPlaceholder")}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("clientToken")}</label>
              <Input
                type="password"
                placeholder={t("clientTokenPlaceholder")}
                value={clientToken}
                onChange={(e) => setClientToken(e.target.value)}
                className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="pt-4 border-t border-border">
              <Button
                onClick={handleSave}
                disabled={updateClinic.isPending}
                className="w-full sm:w-auto h-11 px-8"
              >
                {updateClinic.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                {t("saveConfig")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Card */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <QrCode size={20} className="text-primary" />
              {t("connectQrCode")}
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              {t("qrCodeDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {qrCodeData ? (
              <div className="flex flex-col items-center gap-4">
                <div className="bg-white p-4 rounded-xl shadow-inner border">
                  <img src={qrCodeData} alt="WhatsApp QR Code" className="w-64 h-64 object-contain" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {t("qrCodeInstructions")}
                </p>
                <Button variant="outline" onClick={stopQrPolling} className="text-gray-700 dark:text-gray-300">
                  {t("cancel")}
                </Button>
              </div>
            ) : (
              <Button
                onClick={startQrPolling}
                disabled={isLoadingQr || !instanceId || !token}
                variant="outline"
                className="w-full h-11 text-gray-700 dark:text-gray-300"
              >
                {isLoadingQr ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("generatingQr")}</>
                ) : (
                  <><QrCode className="mr-2 h-4 w-4" /> {t("generateQr")}</>
                )}
              </Button>
            )}
            {!instanceId && (
              <p className="text-xs text-muted-foreground">{t("saveCredentialsFirst")}</p>
            )}
          </CardContent>
        </Card>

        {/* Test Message Card */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Send size={20} className="text-primary" />
              {t("sendTestMessage")}
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              {t("sendTestDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder={t("testPhonePlaceholder")}
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="flex-1 bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
              />
              <Button
                onClick={handleSendTestMessage}
                disabled={isSendingTest || !testPhone.trim()}
                className="h-11 px-6"
              >
                {isSendingTest ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("sending")}</>
                ) : (
                  <><Send className="mr-2 h-4 w-4" /> {t("send")}</>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("phoneHint")}
            </p>
          </CardContent>
        </Card>

        {/* Info Card */}
        <div className="rounded-lg bg-sky-500/5 border border-sky-500/10 p-4">
          <div className="flex gap-3">
            <MessageSquare className="h-5 w-5 text-sky-600 shrink-0" />
            <div className="text-sm text-sky-900/80 dark:text-sky-300/80">
              <p className="font-semibold mb-1">{t("howToGetCredentials")}</p>
              <p>{t("credentialsHelp")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
