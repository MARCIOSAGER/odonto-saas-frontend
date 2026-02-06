"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, Clock, ArrowRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const featuredPost = {
  title: "Como a Inteligência Artificial está revolucionando a odontologia",
  excerpt: "Descubra como ferramentas de IA estão transformando diagnósticos, planos de tratamento e a experiência do paciente nas clínicas odontológicas modernas.",
  image: "/blog/ai-dentistry.jpg",
  category: "Tecnologia",
  date: "5 Fev 2026",
  readTime: "8 min",
  slug: "ia-revolucionando-odontologia",
}

const posts = [
  {
    title: "5 estratégias para reduzir faltas de pacientes na sua clínica",
    excerpt: "Aprenda técnicas comprovadas para diminuir o no-show e aumentar a receita da sua clínica odontológica.",
    category: "Gestão",
    date: "3 Fev 2026",
    readTime: "5 min",
    slug: "reduzir-faltas-pacientes",
  },
  {
    title: "LGPD na odontologia: o que você precisa saber",
    excerpt: "Guia completo sobre como adequar sua clínica às exigências da Lei Geral de Proteção de Dados.",
    category: "Compliance",
    date: "1 Fev 2026",
    readTime: "6 min",
    slug: "lgpd-odontologia",
  },
  {
    title: "Marketing digital para dentistas: guia completo 2026",
    excerpt: "Estratégias práticas de marketing digital para atrair mais pacientes e fortalecer sua presença online.",
    category: "Marketing",
    date: "28 Jan 2026",
    readTime: "10 min",
    slug: "marketing-digital-dentistas",
  },
  {
    title: "Odontograma digital vs. papel: vantagens e desvantagens",
    excerpt: "Comparativo detalhado entre odontogramas digitais e tradicionais para ajudar na sua decisão.",
    category: "Tecnologia",
    date: "25 Jan 2026",
    readTime: "4 min",
    slug: "odontograma-digital-vs-papel",
  },
  {
    title: "Como precificar procedimentos odontológicos corretamente",
    excerpt: "Metodologia prática para calcular preços justos e competitivos para seus serviços.",
    category: "Financeiro",
    date: "22 Jan 2026",
    readTime: "7 min",
    slug: "precificar-procedimentos",
  },
  {
    title: "WhatsApp Business para clínicas: boas práticas",
    excerpt: "Aprenda a usar o WhatsApp de forma profissional para melhorar o atendimento ao paciente.",
    category: "Atendimento",
    date: "20 Jan 2026",
    readTime: "5 min",
    slug: "whatsapp-business-clinicas",
  },
]

const categories = [
  { name: "Todos", count: 24 },
  { name: "Gestão", count: 8 },
  { name: "Tecnologia", count: 6 },
  { name: "Marketing", count: 4 },
  { name: "Financeiro", count: 3 },
  { name: "Compliance", count: 2 },
  { name: "Atendimento", count: 1 },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">Blog INTER-IA</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Conteudo para dentistas modernos
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Artigos, guias e dicas sobre gestao, tecnologia e marketing para clinicas odontologicas.
            </p>

            {/* Search */}
            <div className="mt-8 flex items-center gap-2 mx-auto max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar artigos..."
                  className="pl-10"
                />
              </div>
              <Button>Buscar</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b">
        <div className="container">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {categories.map((cat) => (
              <Button
                key={cat.name}
                variant={cat.name === "Todos" ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap"
              >
                {cat.name} ({cat.count})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="container">
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 md:aspect-auto md:min-h-[400px] flex items-center justify-center">
                <div className="text-6xl">🤖</div>
              </div>
              <CardContent className="flex flex-col justify-center p-8">
                <Badge className="w-fit mb-4">{featuredPost.category}</Badge>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {featuredPost.title}
                </h2>
                <p className="mt-4 text-gray-600">{featuredPost.excerpt}</p>
                <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <Button className="mt-6 w-fit gap-2">
                  Ler artigo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Artigos recentes</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.slug} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-4xl">
                    {post.category === "Gestão" && "📊"}
                    {post.category === "Tecnologia" && "💻"}
                    {post.category === "Marketing" && "📱"}
                    {post.category === "Financeiro" && "💰"}
                    {post.category === "Compliance" && "🔒"}
                    {post.category === "Atendimento" && "💬"}
                  </div>
                </div>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-3">{post.category}</Badge>
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{post.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">
              Carregar mais artigos
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-blue-600">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center text-white">
            <h2 className="text-3xl font-bold">Receba nossos artigos por email</h2>
            <p className="mt-4 text-blue-100">
              Assine nossa newsletter e receba conteudo exclusivo sobre gestao de clinicas odontologicas.
            </p>
            <div className="mt-8 flex gap-2 mx-auto max-w-md">
              <Input
                placeholder="seu@email.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button className="bg-amber-400 hover:bg-amber-500 text-black font-semibold">
                Assinar
              </Button>
            </div>
            <p className="mt-4 text-xs text-blue-200">
              Sem spam. Cancele quando quiser.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
