"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UsageBar } from "@/components/billing/usage-bar"
import { InvoiceTable } from "@/components/billing/invoice-table"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { enUS } from "date-fns/locale"
import {
  CreditCard,
  Crown,
  Loader2,
  AlertTriangle,
  ArrowUpRight,
  X,
} from "lucide-react"
import { Suspense } from "react"

interface Subscription {
  id: string
  status: string
  billing_cycle: string
  current_period_end: string
  cancel_at_period_end: boolean
  trial_end?: string
  plan: {
    name: string
    display_name: string
    price_monthly: number
    price_yearly?: number
  }
}

interface Usage {
  plan_name: string
  plan_display_name: string
  status: string
  usage: {
    patients: { current: number; limit: number | null; percentage: number }
    dentists: { current: number; limit: number | null; percentage: number }
    appointments_month: { current: number; limit: number | null; percentage: number }
  }
}

interface Invoice {
  id: string
  number: string
  amount: number
  total: number
  status: string
  due_date: string
  paid_at?: string
  description?: string
  nfse_status?: string
  nfse_pdf_url?: string
}

function BillingContent() {
  const searchParams = useSearchParams()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [usage, setUsage] = useState<Usage | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  const t = useTranslations("billing")
  const locale = useLocale()
  const dateLocale = locale === "pt-BR" ? ptBR : enUS

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success(t("paymentSuccess"))
    }
    if (searchParams.get("cancelled") === "true") {
      toast.info(t("checkoutCancelled"))
    }
  }, [searchParams])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [subRes, usageRes, invoicesRes] = await Promise.all([
        api.get("/subscriptions/current").catch(() => null),
        api.get("/subscriptions/usage").catch(() => null),
        api.get("/subscriptions/invoices").catch(() => null),
      ])
      if (subRes?.data) setSubscription(subRes.data.data || subRes.data)
      if (usageRes?.data) setUsage(usageRes.data.data || usageRes.data)
      if (invoicesRes?.data) {
        const d = invoicesRes.data.data || invoicesRes.data
        setInvoices(Array.isArray(d) ? d : d?.data || [])
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    if (!confirm(t("cancelConfirm"))) return
    setCancelling(true)
    try {
      await api.post("/subscriptions/cancel")
      toast.success(t("cancelSuccess"))
      loadData()
    } catch {
      toast.error(t("cancelError"))
    } finally {
      setCancelling(false)
    }
  }

  async function handleReactivate() {
    try {
      await api.post("/subscriptions/reactivate")
      toast.success(t("reactivateSuccess"))
      loadData()
    } catch {
      toast.error(t("reactivateError"))
    }
  }

  async function handleUpgrade() {
    window.location.href = "/pricing"
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    active: { label: t("statusActive"), variant: "default" },
    trialing: { label: t("statusTrialing"), variant: "secondary" },
    past_due: { label: t("statusPastDue"), variant: "destructive" },
    cancelled: { label: t("statusCancelled"), variant: "outline" },
    expired: { label: t("statusExpired"), variant: "destructive" },
  }

  const subStatus = subscription ? statusLabels[subscription.status] || statusLabels.active : null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("subtitle")}
        </p>
      </div>

      {/* Trial banner */}
      {subscription?.status === "trialing" && subscription.trial_end && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              {t("trialEndsAt", { date: format(new Date(subscription.trial_end), "PPP", { locale: dateLocale }) })}
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              {t("trialUpgradeHint")}
            </p>
          </div>
          <Button size="sm" onClick={handleUpgrade}>
            {t("upgrade")}
          </Button>
        </div>
      )}

      {/* Current plan */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">
                  {t("plan", { name: subscription?.plan?.display_name || "—" })}
                </h2>
                {subStatus && (
                  <Badge variant={subStatus.variant}>{subStatus.label}</Badge>
                )}
              </div>
              {subscription && (
                <p className="text-sm text-muted-foreground">
                  {t("nextBilling")}: {format(new Date(subscription.current_period_end), "dd/MM/yyyy", { locale: dateLocale })}
                  {" — "}
                  {subscription.billing_cycle === "yearly" ? t("yearly") : t("monthly")}
                </p>
              )}
              {subscription?.cancel_at_period_end && (
                <p className="text-sm text-destructive font-medium">
                  {t("cancelScheduled")}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {subscription?.cancel_at_period_end ? (
                <Button variant="outline" size="sm" onClick={handleReactivate}>
                  {t("reactivate")}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={cancelling || !subscription}
                >
                  {cancelling ? t("cancelling") : t("cancelPlan")}
                </Button>
              )}
              <Button size="sm" onClick={handleUpgrade}>
                <ArrowUpRight className="h-4 w-4 mr-1" />
                {t("changePlan")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage */}
      {usage && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {t("planUsage")}
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <UsageBar
                label={t("usagePatients")}
                current={usage.usage.patients.current}
                limit={usage.usage.patients.limit}
                percentage={usage.usage.patients.percentage}
              />
              <UsageBar
                label={t("usageDentists")}
                current={usage.usage.dentists.current}
                limit={usage.usage.dentists.limit}
                percentage={usage.usage.dentists.percentage}
              />
              <UsageBar
                label={t("usageAppointments")}
                current={usage.usage.appointments_month.current}
                limit={usage.usage.appointments_month.limit}
                percentage={usage.usage.appointments_month.percentage}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoices */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">{t("invoices")}</h3>
          <InvoiceTable invoices={invoices} />
        </CardContent>
      </Card>
    </div>
  )
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <BillingContent />
    </Suspense>
  )
}
