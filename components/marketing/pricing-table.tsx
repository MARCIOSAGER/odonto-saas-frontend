"use client"
import { Button } from "@/components/ui/button"
import { Check, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { env } from "@/lib/env"

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

export function PricingTable() {
  const { data: session } = useSession()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly")
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const t = useTranslations("pricing")

  const featureRows = [
    { key: "patients", label: t("patients") },
    { key: "dentists", label: t("dentists") },
    { key: "appointments", label: t("appointmentsMonth") },
    { key: "whatsapp", label: t("whatsapp") },
    { key: "whatsapp_auto", label: t("whatsappAutomations") },
    { key: "ai", label: t("clinicalAi") },
    { key: "odontogram", label: t("digitalOdontogram") },
    { key: "reports", label: t("reports") },
    { key: "nfse", label: t("autoInvoice") },
    { key: "portal", label: t("patientPortal") },
    { key: "prescription", label: t("digitalPrescription") },
    { key: "nps", label: t("npsReviews") },
    { key: "support", label: t("prioritySupport") },
    { key: "branding", label: t("customBranding") },
    { key: "api", label: t("apiAccess") },
  ]

  function getFeatureValue(plan: Plan, key: string): string | boolean {
    const f = plan.features || {}
    switch (key) {
      case "patients":
        return plan.max_patients ? `${plan.max_patients}` : t("unlimited")
      case "dentists":
        return plan.max_dentists ? `${plan.max_dentists}` : t("unlimited")
      case "appointments":
        return plan.max_appointments_month
          ? `${plan.max_appointments_month}`
          : t("unlimited")
      case "whatsapp":
        return !!f.has_whatsapp
      case "whatsapp_auto":
        return !!f.has_whatsapp_automation
      case "ai":
        if (!f.has_ai) return false
        return f.ai_level === "full" ? t("complete") : t("basic")
      case "odontogram":
        return !!f.has_odontogram
      case "reports":
        if (!f.has_reports) return false
        return f.reports_level === "full" ? t("complete") : t("basic")
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

  const fallbackPlans: Plan[] = [
    {
      id: "1",
      name: "basic",
      display_name: t("basicPlanName"),
      description: t("basicPlanDesc"),
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
      display_name: t("standardPlanName"),
      description: t("standardPlanDesc"),
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
      display_name: t("premiumPlanName"),
      description: t("premiumPlanDesc"),
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

  const handleCheckout = async (planId: string, billingCycle: string) => {
    setCheckoutLoading(planId)
    try {
      const res = await api.post("/billing/checkout", { plan_id: planId, billing_cycle: billingCycle })
      const data = res.data?.data || res.data
      if (data?.checkout_url) {
        window.location.href = data.checkout_url
      } else {
        toast.error(t("checkoutError"))
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || t("checkoutProcessError"))
    } finally {
      setCheckoutLoading(null)
    }
  }

  useEffect(() => {
    fetch(`${env.apiUrl}/plans`)
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("subtitle")}
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
            {t("monthly")}
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
            {t("yearly")}
            <span className="ml-1.5 text-xs text-green-600 font-semibold">{t("yearlyDiscount")}</span>
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
                    {t("mostPopular")}
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
                    <div className="text-4xl font-bold">{t("free")}</div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-muted-foreground">{t("currency")}</span>
                      <span className="text-4xl font-bold">
                        {Math.round(price)}
                      </span>
                      <span className="text-muted-foreground">{t("perMonth")}</span>
                    </div>
                  )}
                  {billing === "yearly" && plan.price_yearly && Number(plan.price_yearly) > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("billedYearly", { value: Number(plan.price_yearly).toLocaleString("pt-BR") })}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  {session ? (
                    <Button
                      className="w-full"
                      variant={isPopular ? "default" : "outline"}
                      disabled={price === 0 || checkoutLoading === plan.id}
                      onClick={() => price > 0 && handleCheckout(plan.id, billing)}
                    >
                      {checkoutLoading === plan.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {price === 0 ? t("currentPlan") : t("subscribe")}
                    </Button>
                  ) : (
                    <Link href="/register">
                      <Button className="w-full" variant={isPopular ? "default" : "outline"}>
                        {price === 0 ? t("startFree") : t("startFreeTrial")}
                      </Button>
                    </Link>
                  )}
                </div>

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
            {t("detailedComparison")}
          </h3>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">{t("feature")}</th>
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
