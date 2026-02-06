"use client"
import { Star, Quote } from "lucide-react"

const ratings = [
  {
    platform: "Google Reviews",
    logo: (
      <svg className="w-6 h-6" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
    rating: "4.9",
    total: "5",
    reviews: "127 avaliacoes",
  },
  {
    platform: "App Store",
    logo: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#000">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    rating: "4.8",
    total: "5",
    reviews: "89 avaliacoes",
  },
  {
    platform: "Atendimento",
    logo: (
      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    rating: "9.8",
    total: "10",
    reviews: "NPS medio",
  },
]

const testimonials = [
  {
    quote: "O INTER-IA transformou a gestao da minha clinica. A organizacao financeira fez toda a diferenca no nosso faturamento.",
    author: "Dra. Camila Oliveira",
    role: "Clinica Sorriso Perfeito",
    avatar: { initials: "CO", color: "bg-pink-500" },
  },
  {
    quote: "A IA para gerar prontuarios economiza horas do meu dia. Nao consigo mais trabalhar sem.",
    author: "Dr. Ricardo Mendes",
    role: "Consultorio Mendes",
    avatar: { initials: "RM", color: "bg-blue-500" },
  },
  {
    quote: "O WhatsApp automatizado reduziu em 70% as faltas dos pacientes. Incrivel como a confirmacao automatica funciona.",
    author: "Dra. Fernanda Lima",
    role: "OdontoVida",
    avatar: { initials: "FL", color: "bg-green-500" },
  },
]

export function SocialProof() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            A confianca de quem usa todos os dias
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Milhares de profissionais confiam no INTER-IA para gerenciar suas clinicas
          </p>
        </div>

        {/* Ratings Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {ratings.map((item, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center mb-4">
                {item.logo}
              </div>
              <p className="text-sm font-medium text-gray-500 mb-2">{item.platform}</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">{item.rating}</span>
                <span className="text-lg text-gray-400">/{item.total}</span>
              </div>
              <div className="flex justify-center gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.floor(parseFloat(item.rating))
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">{item.reviews}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative"
            >
              {/* Quote icon */}
              <div className="absolute -top-3 left-6">
                <div className="bg-blue-500 rounded-full p-2">
                  <Quote className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Quote text */}
              <p className="text-gray-700 leading-relaxed mt-4 mb-6">
                {testimonial.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full ${testimonial.avatar.color} flex items-center justify-center text-white font-semibold`}
                >
                  {testimonial.avatar.initials}
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
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-60">
          <div className="flex items-center gap-2 text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Dados criptografados</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">LGPD Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
            </svg>
            <span className="text-sm font-medium">SSL 256-bit</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">99.9% Uptime</span>
          </div>
        </div>
      </div>
    </section>
  )
}
