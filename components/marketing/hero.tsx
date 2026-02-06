"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield, Clock, Sparkles, Users, Calendar, Brain } from "lucide-react"
import { useTranslations } from "next-intl"

export function Hero() {
  const t = useTranslations("marketing")

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/50" />

      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-violet-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-violet-200/20 to-indigo-200/20 rounded-full blur-3xl" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="container relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Announcement badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 border border-violet-200/50">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-semibold text-violet-700">
              IA integrada para prontuarios automaticos
            </span>
            <ArrowRight className="w-4 h-4 text-violet-600" />
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="text-gray-900">Sua clinica </span>
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              mais inteligente
            </span>
            <br />
            <span className="text-gray-900">em minutos</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Agenda, prontuario, financeiro e WhatsApp em uma plataforma
            potencializada por inteligencia artificial.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/register">
              <Button
                size="lg"
                className="h-14 px-8 text-base font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-xl shadow-violet-500/30 group"
              >
                Comece gratis - 14 dias
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/#how-it-works">
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-base font-medium border-2 border-gray-200 hover:border-violet-300 hover:bg-violet-50/50 group"
              >
                Ver demonstracao
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              <span>Dados criptografados</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-500" />
              <span>Setup em 5 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Sem cartao de credito</span>
            </div>
          </div>
        </div>

        {/* Feature cards grid below */}
        <div className="mt-20 grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            {
              icon: Calendar,
              title: "Agenda Inteligente",
              desc: "Lembretes automaticos",
              gradient: "from-violet-500 to-violet-600"
            },
            {
              icon: Brain,
              title: "Prontuario com IA",
              desc: "Transcricao automatica",
              gradient: "from-indigo-500 to-indigo-600"
            },
            {
              icon: Users,
              title: "Portal do Paciente",
              desc: "Agendamento online",
              gradient: "from-purple-500 to-purple-600"
            },
            {
              icon: Zap,
              title: "WhatsApp Integrado",
              desc: "Mensagens automaticas",
              gradient: "from-emerald-500 to-emerald-600"
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:border-violet-200 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/60 backdrop-blur-sm border border-gray-100">
            <div className="flex -space-x-2">
              {["violet", "indigo", "purple", "emerald"].map((color, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full bg-${color}-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold`}
                  style={{ backgroundColor: color === "violet" ? "#8b5cf6" : color === "indigo" ? "#6366f1" : color === "purple" ? "#a855f7" : "#10b981" }}
                >
                  {["CM", "RS", "AL", "MF"][i]}
                </div>
              ))}
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-left">
              <div className="flex items-center gap-1 mb-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm font-semibold text-gray-700 ml-1">4.9</span>
              </div>
              <p className="text-xs text-gray-500">+2.000 clinicas confiam na INTER-IA</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
