"use client"
import { Button } from "@/components/ui/button"
import { Check, MessageCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Essencial",
    description: "Para dentistas comecando",
    priceMonthly: 99,
    priceYearly: 84, // -15%
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
  },
  {
    name: "Pro",
    description: "Mais Popular",
    priceMonthly: 199,
    priceYearly: 169, // -15%
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
  },
  {
    name: "Enterprise",
    description: "Para grandes clinicas",
    priceMonthly: null, // Sob consulta
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
  },
]

export function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly")

  return (
    <section id="pricing" className="py-20 md:py-28 bg-gray-50">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Planos que cabem no seu bolso
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Escolha o plano ideal para o tamanho da sua clinica. Todos incluem 14 dias gratis.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setBilling("monthly")}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-semibold transition-all",
              billing === "monthly"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-100 border"
            )}
          >
            Mensal
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-semibold transition-all relative",
              billing === "yearly"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-100 border"
            )}
          >
            Anual
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              -15%
            </span>
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={cn(
                "relative bg-white rounded-2xl p-8 flex flex-col",
                plan.popular
                  ? "ring-2 ring-blue-600 shadow-xl scale-[1.02]"
                  : "border border-gray-200 shadow-sm"
              )}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-blue-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg">
                    Mais Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-500 mt-1">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                {plan.priceMonthly !== null ? (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-gray-500">R$</span>
                      <span className="text-5xl font-bold text-gray-900">
                        {billing === "yearly" ? plan.priceYearly : plan.priceMonthly}
                      </span>
                      <span className="text-gray-500">/mes</span>
                    </div>
                    {billing === "yearly" && (
                      <p className="text-sm text-green-600 font-medium mt-1">
                        Economize R$ {((plan.priceMonthly - plan.priceYearly!) * 12).toFixed(0)}/ano
                      </p>
                    )}
                  </>
                ) : (
                  <div>
                    <span className="text-3xl font-bold text-gray-900">Sob Consulta</span>
                    <p className="text-sm text-gray-500 mt-1">Preco personalizado</p>
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
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : plan.priceMonthly === null
                        ? "bg-gray-900 hover:bg-gray-800 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"
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
                      plan.popular ? "text-blue-600" : "text-green-600"
                    )} />
                    <span className="text-gray-700">{feature}</span>
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
