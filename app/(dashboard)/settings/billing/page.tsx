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
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
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

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Pagamento realizado com sucesso!")
    }
    if (searchParams.get("cancelled") === "true") {
      toast.info("Checkout cancelado.")
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
    if (!confirm("Tem certeza que deseja cancelar sua assinatura? Ela continuará ativa até o final do período.")) return
    setCancelling(true)
    try {
      await api.post("/subscriptions/cancel")
      toast.success("Assinatura será cancelada ao final do período.")
      loadData()
    } catch {
      toast.error("Erro ao cancelar assinatura.")
    } finally {
      setCancelling(false)
    }
  }

  async function handleReactivate() {
    try {
      await api.post("/subscriptions/reactivate")
      toast.success("Assinatura reativada!")
      loadData()
    } catch {
      toast.error("Erro ao reativar assinatura.")
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
    active: { label: "Ativa", variant: "default" },
    trialing: { label: "Trial", variant: "secondary" },
    past_due: { label: "Pagamento pendente", variant: "destructive" },
    cancelled: { label: "Cancelada", variant: "outline" },
    expired: { label: "Expirada", variant: "destructive" },
  }

  const subStatus = subscription ? statusLabels[subscription.status] || statusLabels.active : null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assinatura e Faturamento</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie seu plano, pagamentos e faturas.
        </p>
      </div>

      {/* Trial banner */}
      {subscription?.status === "trialing" && subscription.trial_end && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Seu período de teste termina em{" "}
              {format(new Date(subscription.trial_end), "dd 'de' MMMM", { locale: ptBR })}.
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              Faça upgrade para não perder acesso às funcionalidades.
            </p>
          </div>
          <Button size="sm" onClick={handleUpgrade}>
            Fazer upgrade
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
                  Plano {subscription?.plan?.display_name || "—"}
                </h2>
                {subStatus && (
                  <Badge variant={subStatus.variant}>{subStatus.label}</Badge>
                )}
              </div>
              {subscription && (
                <p className="text-sm text-muted-foreground">
                  Próxima cobrança:{" "}
                  {format(new Date(subscription.current_period_end), "dd/MM/yyyy", { locale: ptBR })}
                  {" — "}
                  {subscription.billing_cycle === "yearly" ? "Anual" : "Mensal"}
                </p>
              )}
              {subscription?.cancel_at_period_end && (
                <p className="text-sm text-destructive font-medium">
                  Cancelamento agendado para o final do período.
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {subscription?.cancel_at_period_end ? (
                <Button variant="outline" size="sm" onClick={handleReactivate}>
                  Reativar
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={cancelling || !subscription}
                >
                  {cancelling ? "Cancelando..." : "Cancelar plano"}
                </Button>
              )}
              <Button size="sm" onClick={handleUpgrade}>
                <ArrowUpRight className="h-4 w-4 mr-1" />
                Alterar plano
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
              Uso do plano
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <UsageBar
                label="Pacientes"
                current={usage.usage.patients.current}
                limit={usage.usage.patients.limit}
                percentage={usage.usage.patients.percentage}
              />
              <UsageBar
                label="Dentistas"
                current={usage.usage.dentists.current}
                limit={usage.usage.dentists.limit}
                percentage={usage.usage.dentists.percentage}
              />
              <UsageBar
                label="Agendamentos/mês"
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
          <h3 className="font-semibold mb-4">Faturas</h3>
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
