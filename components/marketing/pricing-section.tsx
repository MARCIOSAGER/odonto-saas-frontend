"use client"
import { Button } from "@/components/ui/button"
import { Check, MessageCircle, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Essencial",
    description: "Para dentistas comecando",
    priceMonthly: 99,
    priceYearly: 84,
    features: [
      "Agenda inteligente",
      "Prontuario digital",
      "Odontograma completo",
      "WhatsApp integrado",
      "App PWA (celular)",
      "Ate 2 dentistas",
      "Ate 200 pacientes",
    ],
    cta: "Comecar teste gratis",
    ctaLink: "/register?plan=essencial",
    popular: false,
    gradient: "from-gray-100 to-gray-50",
    accent: "gray",
  },
  {
    name: "Pro",
    description: "Mais Popular",
    priceMonthly: 199,
    priceYearly: 169,
    features: [
      "Tudo do Essencial, mais:",
      "Relatorios avancados",
      "Comissoes automaticas",
      "NPS e avaliacoes",
      "IA para prontuarios",
      "Ate 10 dentistas",
      "Pacientes ilimitados",
      "Suporte prioritario",
    ],
    cta: "Comecar teste gratis",
    ctaLink: "/register?plan=pro",
    popular: true,
    gradient: "from-violet-600 to-indigo-600",
    accent: "violet",
  },
  {
    name: "Enterprise",
    description: "Para grandes clinicas",
    priceMonthly: null,
    priceYearly: null,
    features: [
      "Tudo do Pro, mais:",
      "Faceograma HOF",
      "CRM de pacientes",
      "Site gratuito personalizado",
      "API de integracao",
      "Dentistas ilimitados",
      "Branding customizado",
      "Gerente de conta dedicado",
    ],
    cta: "Falar com especialista",
    ctaLink: "/contato?plan=enterprise",
    popular: false,
    gradient: "from-gray-900 to-gray-800",
    accent: "gray",
  },
]

export function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly")

  return (
    <section id="pricing" className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 border border-violet-200/50">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-semibold text-violet-700">
              14 dias gratis em todos os planos
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Planos que cabem no seu bolso
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Escolha o plano ideal para o tamanho da sua clinica
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setBilling("monthly")}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-semibold transition-all",
              billing === "monthly"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            )}
          >
            Mensal
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-semibold transition-all relative",
              billing === "yearly"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            )}
          >
            Anual
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              -15%
            </span>
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl p-8 flex flex-col",
                plan.popular
                  ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-2xl shadow-violet-500/30 scale-[1.02]"
                  : "bg-white border border-gray-200 shadow-sm"
              )}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-white text-violet-600 text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg">
                    Mais Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className={cn(
                  "text-2xl font-bold",
                  plan.popular ? "text-white" : "text-gray-900"
                )}>
                  {plan.name}
                </h3>
                <p className={cn(
                  "mt-1",
                  plan.popular ? "text-white/80" : "text-gray-500"
                )}>
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                {plan.priceMonthly !== null ? (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className={cn(
                        "text-sm",
                        plan.popular ? "text-white/80" : "text-gray-500"
                      )}>R$</span>
                      <span className={cn(
                        "text-5xl font-bold",
                        plan.popular ? "text-white" : "text-gray-900"
                      )}>
                        {billing === "yearly" ? plan.priceYearly : plan.priceMonthly}
                      </span>
                      <span className={plan.popular ? "text-white/80" : "text-gray-500"}>/mes</span>
                    </div>
                    {billing === "yearly" && (
                      <p className={cn(
                        "text-sm font-medium mt-1",
                        plan.popular ? "text-emerald-300" : "text-emerald-600"
                      )}>
                        Economize R$ {((plan.priceMonthly - plan.priceYearly!) * 12).toFixed(0)}/ano
                      </p>
                    )}
                  </>
                ) : (
                  <div>
                    <span className={cn(
                      "text-3xl font-bold",
                      plan.popular ? "text-white" : "text-gray-900"
                    )}>
                      Sob Consulta
                    </span>
                    <p className={cn(
                      "text-sm mt-1",
                      plan.popular ? "text-white/80" : "text-gray-500"
                    )}>
                      Preco personalizado
                    </p>
                  </div>
                )}
              </div>

              {/* CTA */}
              <Link href={plan.ctaLink} className="mb-8">
                <Button
                  size="lg"
                  className={cn(
                    "w-full h-12 text-base font-semibold group",
                    plan.popular
                      ? "bg-white hover:bg-white/90 text-violet-600"
                      : plan.priceMonthly === null
                        ? "bg-gray-900 hover:bg-gray-800 text-white"
                        : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                  )}
                >
                  {plan.priceMonthly === null ? (
                    <>
                      <MessageCircle className="mr-2 h-5 w-5" />
                      {plan.cta}
                    </>
                  ) : (
                    <>
                      {plan.cta}
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </Link>

              {/* Features */}
              <div className="space-y-3 flex-1">
                {plan.features.map((feature, fi) => (
                  <div key={fi} className="flex items-start gap-3">
                    <Check className={cn(
                      "h-5 w-5 shrink-0 mt-0.5",
                      plan.popular ? "text-emerald-300" : "text-emerald-500"
                    )} />
                    <span className={plan.popular ? "text-white/90" : "text-gray-700"}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-12">
          <p className="text-gray-500">
            Todos os planos incluem: suporte via chat, atualizacoes gratuitas e backup automatico.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Sem fidelidade. Cancele quando quiser.
          </p>
        </div>
      </div>
    </section>
  )
}
