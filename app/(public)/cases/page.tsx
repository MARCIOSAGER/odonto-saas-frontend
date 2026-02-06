"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Quote, Star, TrendingUp, Users, Award, CheckCircle, ArrowRight, Sparkles } from "lucide-react"

const stats = [
  { value: "2.000+", label: "Clinicas ativas", icon: Users },
  { value: "150.000+", label: "Pacientes gerenciados", icon: TrendingUp },
  { value: "98%", label: "Satisfacao dos clientes", icon: Award },
  { value: "4.9", label: "Avaliacao media", icon: Star },
]

const cases = [
  {
    clinic: "Odonto Excellence",
    location: "Sao Paulo, SP",
    logo: "OE",
    quote: "Reduzimos em 70% as faltas de pacientes com os lembretes automaticos do INTER-IA. A integracao com WhatsApp mudou completamente nossa rotina.",
    author: "Dra. Marina Silva",
    role: "Proprietaria",
    metrics: [
      { label: "Reducao de faltas", value: "-70%" },
      { label: "Aumento de receita", value: "+45%" },
      { label: "Tempo economizado", value: "15h/semana" },
    ],
    features: ["Agenda inteligente", "WhatsApp integrado", "Lembretes automaticos"],
    gradient: "from-violet-600 to-indigo-600",
  },
  {
    clinic: "Sorriso Perfeito",
    location: "Rio de Janeiro, RJ",
    logo: "SP",
    quote: "O odontograma digital e a IA para prontuarios transformaram a qualidade dos nossos registros clinicos. Agora temos tudo documentado de forma profissional.",
    author: "Dr. Carlos Mendes",
    role: "Diretor Clinico",
    metrics: [
      { label: "Tempo por consulta", value: "-30%" },
      { label: "Qualidade dos registros", value: "+85%" },
      { label: "Satisfacao pacientes", value: "9.8 NPS" },
    ],
    features: ["Odontograma digital", "IA para prontuarios", "Portal do paciente"],
    gradient: "from-indigo-600 to-purple-600",
  },
  {
    clinic: "Clinica Dental Care",
    location: "Belo Horizonte, MG",
    logo: "DC",
    quote: "Saimos de planilhas para um sistema completo. A gestao financeira integrada nos deu visibilidade total sobre a saude do negocio.",
    author: "Dra. Patricia Alves",
    role: "Socia-fundadora",
    metrics: [
      { label: "Controle financeiro", value: "100%" },
      { label: "Inadimplencia", value: "-60%" },
      { label: "ROI", value: "12x" },
    ],
    features: ["Gestao financeira", "Relatorios automaticos", "Controle de comissoes"],
    gradient: "from-purple-600 to-violet-600",
  },
]

const testimonials = [
  {
    quote: "Finalmente um sistema que entende a realidade de uma clinica odontologica brasileira.",
    author: "Dr. Roberto Farias",
    clinic: "OdontoVida",
    location: "Curitiba, PR",
    initials: "RF",
  },
  {
    quote: "O suporte e excepcional. Sempre que preciso de ajuda, a resposta e rapida e eficiente.",
    author: "Dra. Juliana Costa",
    clinic: "Dental Prime",
    location: "Salvador, BA",
    initials: "JC",
  },
  {
    quote: "A melhor decisao que tomei foi migrar para o INTER-IA. Simples, completo e acessivel.",
    author: "Dr. Fernando Lima",
    clinic: "Clinica Sorrir",
    location: "Recife, PE",
    initials: "FL",
  },
  {
    quote: "Meus pacientes adoram o portal online. Eles conseguem ver historico, receitas e agendar consultas.",
    author: "Dra. Amanda Souza",
    clinic: "Odonto Familia",
    location: "Fortaleza, CE",
    initials: "AS",
  },
]

const clientLogos = [
  "Odonto Excellence", "Sorriso Perfeito", "Dental Care", "OdontoVida",
  "Dental Prime", "Clinica Sorrir", "Odonto Familia", "Dental Center",
  "Sorriso & Cia", "OdontoPlan", "Clinica Oral", "Dental Plus",
]

export default function CasesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-violet-50 via-indigo-50/30 to-white py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 border border-violet-200/50">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-semibold text-violet-700">Cases de Sucesso</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Clinicas que <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">crescem</span> com INTER-IA
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Conheca as historias de dentistas que transformaram suas clinicas com nossa plataforma.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center border-gray-100 hover:border-violet-200 transition-colors">
                <CardContent className="py-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 mb-3`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center justify-center gap-1 text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Casos em destaque</h2>
          <div className="space-y-12">
            {cases.map((caseStudy, index) => (
              <Card key={caseStudy.clinic} className={`overflow-hidden border-gray-100 shadow-lg ${index % 2 === 1 ? 'bg-slate-50' : ''}`}>
                <CardContent className="p-0">
                  <div className={`grid md:grid-cols-2 ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                    {/* Content */}
                    <div className={`p-8 ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${caseStudy.gradient} text-lg font-bold text-white shadow-lg`}>
                          {caseStudy.logo}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{caseStudy.clinic}</h3>
                          <p className="text-sm text-gray-500">{caseStudy.location}</p>
                        </div>
                      </div>

                      <blockquote className="relative">
                        <Quote className="absolute -left-2 -top-2 h-8 w-8 text-violet-100" />
                        <p className="pl-6 text-lg text-gray-700 italic">
                          &quot;{caseStudy.quote}&quot;
                        </p>
                      </blockquote>

                      <div className="mt-4 flex items-center gap-2">
                        <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${caseStudy.gradient} flex items-center justify-center text-white text-sm font-semibold`}>
                          {caseStudy.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{caseStudy.author}</p>
                          <p className="text-sm text-gray-500">{caseStudy.role}</p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {caseStudy.features.map((feature) => (
                          <Badge key={feature} className="bg-violet-100 text-violet-700 hover:bg-violet-200">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className={`bg-gradient-to-br ${caseStudy.gradient} p-8 text-white ${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                      <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Resultados alcancados
                      </h4>
                      <div className="space-y-6">
                        {caseStudy.metrics.map((metric) => (
                          <div key={metric.label}>
                            <p className="text-4xl font-bold">{metric.value}</p>
                            <p className="text-white/80">{metric.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="container">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">O que nossos clientes dizem</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.author} className="border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700">&quot;{testimonial.quote}&quot;</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.clinic} - {testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Clinicas que confiam no INTER-IA</h2>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {clientLogos.map((logo) => (
              <div
                key={logo}
                className="flex h-20 items-center justify-center rounded-xl border border-gray-100 bg-white p-4 text-center text-sm font-medium text-gray-600 hover:border-violet-200 hover:shadow-md transition-all duration-300"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center text-white">
            <h2 className="text-3xl font-bold">Pronto para ser o proximo case de sucesso?</h2>
            <p className="mt-4 text-violet-100">
              Junte-se a milhares de clinicas que ja transformaram sua gestao com o INTER-IA.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white hover:bg-white/90 text-violet-600 font-semibold shadow-xl group">
                  Comecar teste gratis
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-2 border-white/30 bg-white/5 hover:bg-white/10 text-white">
                  Ver planos e precos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
