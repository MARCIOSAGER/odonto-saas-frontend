"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageCircle, CheckCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { usePlatformBranding } from "@/hooks/usePlatformBranding"

export function Hero() {
  const { branding } = usePlatformBranding()
  const t = useTranslations("marketing")

  // Placeholder avatars for social proof
  const avatars = [
    { initials: "CM", color: "bg-blue-500" },
    { initials: "RS", color: "bg-green-500" },
    { initials: "AL", color: "bg-purple-500" },
    { initials: "MF", color: "bg-amber-500" },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/50">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-blue-100/40 blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-green-100/30 blur-3xl" />

      <div className="container relative z-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
              <CheckCircle className="h-4 w-4" />
              {t("trialBadge")}
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-gray-900">
              {branding.heroTitle || "Gestao completa para sua clinica odontologica"}
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
              {branding.heroSubtitle || "Agenda inteligente, prontuario com IA, financeiro integrado e WhatsApp automatizado. Tudo em uma unica plataforma."}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-14 px-8 text-base font-semibold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25 group"
                >
                  {t("startFreeTrial")}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/contato">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base font-medium border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 group"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Falar com um especialista
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {avatars.map((avatar, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full ${avatar.color} border-2 border-white flex items-center justify-center text-white text-sm font-semibold shadow-md`}
                  >
                    {avatar.initials}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Aprovado por +2.000 profissionais</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm text-gray-500 ml-1">4.9/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Dashboard Screenshot */}
          <div className="relative lg:pl-8">
            <div className="relative">
              {/* Browser mockup frame */}
              <div className="rounded-2xl bg-white shadow-2xl shadow-blue-900/10 border border-gray-200 overflow-hidden">
                {/* Browser header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white rounded-md px-3 py-1.5 text-xs text-gray-500 border">
                      app.inter-ia.com.br/dashboard
                    </div>
                  </div>
                </div>

                {/* Dashboard Preview (Placeholder) */}
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-50 to-blue-50 p-6">
                  {/* Mini dashboard mockup */}
                  <div className="h-full flex flex-col gap-4">
                    {/* Top stats row */}
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: "Agendamentos", value: "32", color: "bg-blue-500" },
                        { label: "Pacientes", value: "1.847", color: "bg-green-500" },
                        { label: "Receita", value: "R$ 45k", color: "bg-purple-500" },
                        { label: "NPS", value: "9.2", color: "bg-amber-500" },
                      ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-lg p-3 shadow-sm border">
                          <div className={`w-8 h-8 ${stat.color} rounded-lg mb-2 flex items-center justify-center`}>
                            <div className="w-4 h-4 bg-white/30 rounded" />
                          </div>
                          <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                          <p className="text-xs text-gray-500">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Calendar and chart row */}
                    <div className="flex-1 grid grid-cols-5 gap-3">
                      {/* Calendar */}
                      <div className="col-span-3 bg-white rounded-lg p-4 shadow-sm border">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-gray-900">Agenda de Hoje</p>
                          <div className="text-xs text-blue-600 font-medium">Ver tudo</div>
                        </div>
                        <div className="space-y-2">
                          {[
                            { time: "09:00", name: "Maria Silva", proc: "Limpeza" },
                            { time: "10:30", name: "Joao Santos", proc: "Consulta" },
                            { time: "14:00", name: "Ana Costa", proc: "Canal" },
                          ].map((apt, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                              <div className="text-xs font-semibold text-blue-600 w-12">{apt.time}</div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{apt.name}</p>
                                <p className="text-xs text-gray-500">{apt.proc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mini chart */}
                      <div className="col-span-2 bg-white rounded-lg p-4 shadow-sm border">
                        <p className="text-sm font-semibold text-gray-900 mb-3">Receita Mensal</p>
                        <div className="flex items-end gap-1 h-24">
                          {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                            <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${h}%` }} />
                          ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-400">
                          <span>Seg</span>
                          <span>Dom</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -left-4 top-1/4 bg-white rounded-xl shadow-lg px-4 py-3 border flex items-center gap-3 animate-float">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">WhatsApp Conectado</p>
                  <p className="text-xs text-gray-500">Mensagens automaticas</p>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 bg-white rounded-xl shadow-lg px-4 py-3 border flex items-center gap-3 animate-float-delayed">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">IA Ativa</p>
                  <p className="text-xs text-gray-500">Prontuarios gerados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite 1.5s;
        }
      `}</style>
    </section>
  )
}
