"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Calendar, Copy, ExternalLink, AlertTriangle } from "lucide-react"

interface BookingSettings {
  enabled: boolean
  slug: string | null
  link: string | null
}

export default function BookingSettingsPage() {
  const [settings, setSettings] = useState<BookingSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const t = useTranslations("settings.booking")

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const res = await api.get("/clinics/my/public-booking-settings")
      setSettings(res.data?.data || res.data)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao carregar configurações")
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (enabled: boolean) => {
    setSaving(true)
    try {
      const res = await api.put("/clinics/my/public-booking-settings", { enabled })
      setSettings(res.data?.data || res.data)
      toast.success(enabled ? t("enabledSuccess") : t("disabledSuccess"))
    } catch (err: any) {
      toast.error(err?.response?.data?.message || t("saveError"))
    } finally {
      setSaving(false)
    }
  }

  const copyLink = () => {
    if (settings?.link) {
      navigator.clipboard.writeText(settings.link)
      toast.success(t("linkCopied"))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t("onlineBooking")}
          </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">{t("enableBooking")}</div>
              <div className="text-xs text-muted-foreground">{t("enableDescription")}</div>
            </div>
            <Switch
              checked={settings?.enabled || false}
              onCheckedChange={handleToggle}
              disabled={saving || !settings?.slug}
            />
          </div>

          {/* Warning if no slug */}
          {!settings?.slug && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-800">{t("noSlugTitle")}</p>
                <p className="text-xs text-amber-700">{t("noSlugDescription")}</p>
                <Button
                  variant="link"
                  className="h-auto p-0 text-amber-700"
                  onClick={() => window.location.href = "/settings/clinic"}
                >
                  {t("configureSlug")}
                </Button>
              </div>
            </div>
          )}

          {/* Booking link */}
          {settings?.enabled && settings?.link && (
            <div className="space-y-3">
              <div className="text-sm font-medium">{t("bookingLink")}</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border bg-muted/50 px-4 py-3">
                  <code className="text-sm break-all">{settings.link}</code>
                </div>
                <Button variant="outline" size="icon" onClick={copyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href={settings.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">{t("shareTip")}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="rounded-lg bg-muted/50 p-4 space-y-3">
            <p className="text-sm font-medium">{t("howItWorks")}</p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground flex-shrink-0">1</span>
                {t("step1")}
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground flex-shrink-0">2</span>
                {t("step2")}
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground flex-shrink-0">3</span>
                {t("step3")}
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground flex-shrink-0">4</span>
                {t("step4")}
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
