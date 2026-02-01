"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InvoiceTable } from "@/components/billing/invoice-table"
import { api } from "@/lib/api"
import {
  DollarSign,
  Users,
  TrendingUp,
  AlertTriangle,
  Loader2,
  Receipt,
} from "lucide-react"

interface Overview {
  mrr: number
  active_subscriptions: number
  trialing_subscriptions: number
  past_due_subscriptions: number
  total_revenue: number
  monthly_revenue: number
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
  clinic?: { name: string }
}

export default function AdminBillingPage() {
  const [overview, setOverview] = useState<Overview | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [overviewRes, invoicesRes] = await Promise.all([
        api.get("/billing/admin/overview"),
        api.get("/billing/admin/invoices?limit=20"),
      ])
      if (overviewRes?.data) setOverview(overviewRes.data.data || overviewRes.data)
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

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Painel Financeiro</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral de receita, assinaturas e faturamento.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">MRR</p>
                <p className="text-2xl font-bold">
                  R$ {overview?.mrr?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "0,00"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assinaturas ativas</p>
                <p className="text-2xl font-bold">{overview?.active_subscriptions || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Em trial</p>
                <p className="text-2xl font-bold">{overview?.trialing_subscriptions || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pagamento pendente</p>
                <p className="text-2xl font-bold">{overview?.past_due_subscriptions || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Receipt className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Receita do mês</p>
                <p className="text-xl font-bold">
                  R$ {overview?.monthly_revenue?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "0,00"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Receita total</p>
                <p className="text-xl font-bold">
                  R$ {overview?.total_revenue?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "0,00"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latest invoices */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Últimas faturas</h3>
          <InvoiceTable invoices={invoices} />
        </CardContent>
      </Card>
    </div>
  )
}
