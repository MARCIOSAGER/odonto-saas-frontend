"use client"
import { Button } from "@/components/ui/button"
import { Check, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface PlanFeatures {
  has_whatsapp?: boolean
  has_whatsapp_automation?: boolean
  has_ai?: boolean
  ai_level?: string
  has_odontogram?: boolean
  has_reports?: boolean
  reports_level?: string
  has_nfse_auto?: boolean
  has_patient_portal?: boolean
  has_prescription?: boolean
  has_nps?: boolean
}

interface Plan {
  id: string
  name: string
  display_name: string
  description?: string
  price_monthly: number
  price_yearly?: number
  max_patients?: number | null
  max_dentists?: number | null
  max_appointments_month?: number | null
  features?: PlanFeatures
  ai_enabled: boolean
  priority_support: boolean
  custom_branding: boolean
  api_access: boolean
  sort_order: number
}

const featureRows = [
  { key: "patients", label: "Pacientes" },
  { key: "dentists", label: "Dentistas" },
  { key: "appointments", label: "Agendamentos/mês" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "whatsapp_auto", label: "Automações WhatsApp" },
  { key: "ai", label: "IA clínica" },
  { key: "odontogram", label: "Odontograma digital" },
  { key: "reports", label: "Relatórios" },
  { key: "nfse", label: "NFS-e automática" },
  { key: "portal", label: "Portal do paciente" },
  { key: "prescription", label: "Receituário digital" },
  { key: "nps", label: "NPS e avaliações" },
  { key: "support", label: "Suporte prioritário" },
  { key: "branding", label: "Marca própria" },
  { key: "api", label: "Acesso API" },
]

function getFeatureValue(plan: Plan, key: string): string | boolean {
  const f = plan.features || {}
  switch (key) {
    case "patients":
      return plan.max_patients ? `${plan.max_patients}` : "Ilimitado"
    case "dentists":
      return plan.max_dentists ? `${plan.max_dentists}` : "Ilimitado"
    case "appointments":
      return plan.max_appointments_month
        ? `${plan.max_appointments_month}`
        : "Ilimitado"
    case "whatsapp":
      return !!f.has_whatsapp
    case "whatsapp_auto":
      return !!f.has_whatsapp_automation
    case "ai":
      if (!f.has_ai) return false
      return f.ai_level === "full" ? "Completo" : "Básico"
    case "odontogram":
      return !!f.has_odontogram
    case "reports":
      if (!f.has_reports) return false
      return f.reports_level === "full" ? "Completo" : "Básico"
    case "nfse":
      return !!f.has_nfse_auto
    case "portal":
      return !!f.has_patient_portal
    case "prescription":
      return !!f.has_prescription
    case "nps":
      return !!f.has_nps
    case "support":
      return plan.priority_support
    case "branding":
      return plan.custom_branding
    case "api":
      return plan.api_access
    default:
      return false
  }
}

function FeatureCell({ value }: { value: string | boolean }) {
  if (typeof value === "string") {
    return <span className="text-sm font-medium">{value}</span>
  }
  return value ? (
    <Check className="h-4 w-4 text-green-600 mx-auto" />
  ) : (
    <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
  )
}

// Fallback plans if API is unavailable
const fallbackPlans: Plan[] = [
  {
    id: "1",
    name: "basic",
    display_name: "Básico",
    description: "Ideal para começar. Gerencie sua clínica com as funcionalidades essenciais.",
    price_monthly: 0,
    price_yearly: 0,
    max_patients: 50,
    max_dentists: 2,
    max_appointments_month: 100,
    features: {
      has_whatsapp: false,
      has_whatsapp_automation: false,
      has_ai: false,
      ai_level: "none",
      has_odontogram: true,
      has_reports: true,
      reports_level: "basic",
      has_nfse_auto: false,
      has_patient_portal: false,
      has_prescription: true,
      has_nps: false,
    },
    ai_enabled: false,
    priority_support: false,
    custom_branding: false,
    api_access: false,
    sort_order: 0,
  },
  {
    id: "2",
    name: "standard",
    display_name: "Padrão",
    description: "Para clínicas em crescimento. WhatsApp, IA básica e relatórios completos.",
    price_monthly: 197,
    price_yearly: 1970,
    max_patients: 500,
    max_dentists: 10,
    max_appointments_month: 1000,
    features: {
      has_whatsapp: true,
      has_whatsapp_automation: false,
      has_ai: true,
      ai_level: "basic",
      has_odontogram: true,
      has_reports: true,
      reports_level: "full",
      has_nfse_auto: false,
      has_patient_portal: true,
      has_prescription: true,
      has_nps: false,
    },
    ai_enabled: true,
    priority_support: false,
    custom_branding: true,
    api_access: false,
    sort_order: 1,
  },
  {
    id: "3",
    name: "premium",
    display_name: "Premium",
    description: "Tudo ilimitado. IA completa, automações WhatsApp, NFS-e automática e suporte prioritário.",
    price_monthly: 397,
    price_yearly: 3970,
    max_patients: null,
    max_dentists: null,
    max_appointments_month: null,
    features: {
      has_whatsapp: true,
      has_whatsapp_automation: true,
      has_ai: true,
      ai_level: "full",
      has_odontogram: true,
      has_reports: true,
      reports_level: "full",
      has_nfse_auto: true,
      has_patient_portal: true,
      has_prescription: true,
      has_nps: true,
    },
    ai_enabled: true,
    priority_support: true,
    custom_branding: true,
    api_access: true,
    sort_order: 2,
  },
]

export function PricingTable() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly")

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    fetch(`${apiUrl}/plans`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data || data
        if (Array.isArray(list) && list.length > 0) {
          setPlans(list)
        } else {
          setPlans(fallbackPlans)
        }
      })
      .catch(() => {
        setPlans(fallbackPlans)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Planos simples e transparentes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comece grátis e escale conforme sua clínica cresce.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <button
            onClick={() => setBilling("monthly")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              billing === "monthly"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Mensal
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              billing === "yearly"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Anual
            <span className="ml-1.5 text-xs text-green-600 font-semibold">-17%</span>
          </button>
        </div>

        {/* Plan cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const isPopular = plan.name === "standard"
            const price =
              billing === "yearly" && plan.price_yearly
                ? Number(plan.price_yearly) / 12
                : Number(plan.price_monthly)

            return (
              <div
                key={plan.id}
                className={cn(
                  "rounded-2xl border p-6 flex flex-col relative",
                  isPopular
                    ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]"
                    : "border-border"
                )}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Mais popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold">{plan.display_name}</h3>
                  {plan.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                  )}
                </div>

                <div className="mb-6">
                  {price === 0 ? (
                    <div className="text-4xl font-bold">Grátis</div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-muted-foreground">R$</span>
                      <span className="text-4xl font-bold">
                        {Math.round(price)}
                      </span>
                      <span className="text-muted-foreground">/mês</span>
                    </div>
                  )}
                  {billing === "yearly" && plan.price_yearly && Number(plan.price_yearly) > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      R$ {Number(plan.price_yearly).toLocaleString("pt-BR")} cobrados anualmente
                    </p>
                  )}
                </div>

                <Link href="/register" className="mb-6">
                  <Button
                    className="w-full"
                    variant={isPopular ? "default" : "outline"}
                  >
                    {price === 0 ? "Começar grátis" : "Começar teste grátis"}
                  </Button>
                </Link>

                <div className="space-y-3 flex-1">
                  {featureRows.map((row) => {
                    const value = getFeatureValue(plan, row.key)
                    if (value === false) return null
                    return (
                      <div key={row.key} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 shrink-0" />
                        <span>
                          {row.label}
                          {typeof value === "string" && (
                            <span className="text-muted-foreground ml-1">
                              ({value})
                            </span>
                          )}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Comparison table (desktop) */}
        <div className="hidden lg:block mt-16 max-w-5xl mx-auto">
          <h3 className="text-xl font-bold text-center mb-8">
            Comparação detalhada
          </h3>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Funcionalidade</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="p-4 text-center font-semibold">
                      {plan.display_name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureRows.map((row, i) => (
                  <tr
                    key={row.key}
                    className={cn("border-b", i % 2 === 0 ? "bg-background" : "bg-muted/20")}
                  >
                    <td className="p-4 font-medium">{row.label}</td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="p-4 text-center">
                        <FeatureCell value={getFeatureValue(plan, row.key)} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
