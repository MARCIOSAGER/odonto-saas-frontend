"use client"
import { Star, Quote, Award, TrendingUp, Users } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "2.000+",
    label: "Clinicas ativas",
    color: "violet"
  },
  {
    icon: TrendingUp,
    value: "98%",
    label: "Taxa de satisfacao",
    color: "indigo"
  },
  {
    icon: Award,
    value: "4.9",
    label: "Avaliacao media",
    color: "purple"
  },
]

const testimonials = [
  {
    quote: "O INTER-IA transformou a gestao da minha clinica. A organizacao financeira fez toda a diferenca no nosso faturamento.",
    author: "Dra. Camila Oliveira",
    role: "Clinica Sorriso Perfeito",
    initials: "CO",
    gradient: "from-violet-500 to-violet-600",
  },
  {
    quote: "A IA para gerar prontuarios economiza horas do meu dia. Nao consigo mais trabalhar sem essa ferramenta.",
    author: "Dr. Ricardo Mendes",
    role: "Consultorio Mendes",
    initials: "RM",
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    quote: "O WhatsApp automatizado reduziu em 70% as faltas dos pacientes. A confirmacao automatica funciona perfeitamente.",
    author: "Dra. Fernanda Lima",
    role: "OdontoVida",
    initials: "FL",
    gradient: "from-purple-500 to-purple-600",
  },
]

export function SocialProof() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container">
        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-violet-50/50 border border-violet-100/50"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${
                stat.color === "violet" ? "from-violet-500 to-violet-600" :
                stat.color === "indigo" ? "from-indigo-500 to-indigo-600" :
                "from-purple-500 to-purple-600"
              } mb-4`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <p className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-gray-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            O que nossos clientes dizem
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Profissionais que transformaram suas clinicas com o INTER-IA
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-violet-200 transition-all duration-300"
            >
              {/* Quote icon */}
              <div className="absolute -top-3 left-6">
                <div className={`bg-gradient-to-br ${testimonial.gradient} rounded-full p-2 shadow-lg`}>
                  <Quote className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-0.5 mb-4 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-gray-700 leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-semibold shadow-lg`}
                >
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-400">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Criptografia AES-256</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">LGPD Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
            </svg>
            <span className="text-sm font-medium">SSL 256-bit</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">99.9% Uptime</span>
          </div>
        </div>
      </div>
    </section>
  )
}
