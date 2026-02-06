"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, Search, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"

const featuredPost = {
  title: "Como a Inteligencia Artificial esta revolucionando a odontologia",
  excerpt: "Descubra como ferramentas de IA estao transformando diagnosticos, planos de tratamento e a experiencia do paciente nas clinicas odontologicas modernas.",
  image: "/blog/ai-dentistry.jpg",
  category: "Tecnologia",
  date: "5 Fev 2026",
  readTime: "8 min",
  slug: "ia-revolucionando-odontologia",
}

const posts = [
  {
    title: "5 estrategias para reduzir faltas de pacientes na sua clinica",
    excerpt: "Aprenda tecnicas comprovadas para diminuir o no-show e aumentar a receita da sua clinica odontologica.",
    category: "Gestao",
    date: "3 Fev 2026",
    readTime: "5 min",
    slug: "reduzir-faltas-pacientes",
  },
  {
    title: "LGPD na odontologia: o que voce precisa saber",
    excerpt: "Guia completo sobre como adequar sua clinica as exigencias da Lei Geral de Protecao de Dados.",
    category: "Compliance",
    date: "1 Fev 2026",
    readTime: "6 min",
    slug: "lgpd-odontologia",
  },
  {
    title: "Marketing digital para dentistas: guia completo 2026",
    excerpt: "Estrategias praticas de marketing digital para atrair mais pacientes e fortalecer sua presenca online.",
    category: "Marketing",
    date: "28 Jan 2026",
    readTime: "10 min",
    slug: "marketing-digital-dentistas",
  },
  {
    title: "Odontograma digital vs. papel: vantagens e desvantagens",
    excerpt: "Comparativo detalhado entre odontogramas digitais e tradicionais para ajudar na sua decisao.",
    category: "Tecnologia",
    date: "25 Jan 2026",
    readTime: "4 min",
    slug: "odontograma-digital-vs-papel",
  },
  {
    title: "Como precificar procedimentos odontologicos corretamente",
    excerpt: "Metodologia pratica para calcular precos justos e competitivos para seus servicos.",
    category: "Financeiro",
    date: "22 Jan 2026",
    readTime: "7 min",
    slug: "precificar-procedimentos",
  },
  {
    title: "WhatsApp Business para clinicas: boas praticas",
    excerpt: "Aprenda a usar o WhatsApp de forma profissional para melhorar o atendimento ao paciente.",
    category: "Atendimento",
    date: "20 Jan 2026",
    readTime: "5 min",
    slug: "whatsapp-business-clinicas",
  },
]

const categories = [
  { name: "Todos", count: 24 },
  { name: "Gestao", count: 8 },
  { name: "Tecnologia", count: 6 },
  { name: "Marketing", count: 4 },
  { name: "Financeiro", count: 3 },
  { name: "Compliance", count: 2 },
  { name: "Atendimento", count: 1 },
]

const categoryColors: Record<string, string> = {
  "Gestao": "bg-violet-100 text-violet-700",
  "Tecnologia": "bg-indigo-100 text-indigo-700",
  "Marketing": "bg-purple-100 text-purple-700",
  "Financeiro": "bg-emerald-100 text-emerald-700",
  "Compliance": "bg-amber-100 text-amber-700",
  "Atendimento": "bg-cyan-100 text-cyan-700",
}

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-violet-50 via-indigo-50/30 to-white py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 border border-violet-200/50">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-semibold text-violet-700">Blog INTER-IA</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Conteudo para dentistas <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">modernos</span>
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
                  className="pl-10 border-gray-200 focus:border-violet-300 focus:ring-violet-200"
                />
              </div>
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-gray-100">
        <div className="container">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {categories.map((cat) => (
              <Button
                key={cat.name}
                variant={cat.name === "Todos" ? "default" : "outline"}
                size="sm"
                className={cat.name === "Todos"
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white whitespace-nowrap"
                  : "whitespace-nowrap border-gray-200 hover:border-violet-300 hover:text-violet-600"
                }
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
          <Card className="overflow-hidden border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="grid md:grid-cols-2">
              <div className="aspect-video bg-gradient-to-br from-violet-100 via-indigo-100 to-purple-100 md:aspect-auto md:min-h-[400px] flex items-center justify-center">
                <div className="text-6xl">🤖</div>
              </div>
              <CardContent className="flex flex-col justify-center p-8">
                <Badge className={`w-fit mb-4 ${categoryColors[featuredPost.category]}`}>
                  {featuredPost.category}
                </Badge>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {featuredPost.title}
                </h2>
                <p className="mt-4 text-gray-600">{featuredPost.excerpt}</p>
                <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-violet-500" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-violet-500" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <Button className="mt-6 w-fit gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 group">
                  Ler artigo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 bg-gradient-to-b from-slate-50 to-white">
        <div className="container">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Artigos recentes</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.slug} className="overflow-hidden border-gray-100 hover:shadow-lg hover:border-violet-200 transition-all duration-300 group">
                <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <div className="text-4xl group-hover:scale-110 transition-transform">
                    {post.category === "Gestao" && "📊"}
                    {post.category === "Tecnologia" && "💻"}
                    {post.category === "Marketing" && "📱"}
                    {post.category === "Financeiro" && "💰"}
                    {post.category === "Compliance" && "🔒"}
                    {post.category === "Atendimento" && "💬"}
                  </div>
                </div>
                <CardContent className="p-6">
                  <Badge className={`mb-3 ${categoryColors[post.category] || "bg-gray-100 text-gray-700"}`}>
                    {post.category}
                  </Badge>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-violet-600 transition-colors">
                    {post.title}
                  </h3>
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
            <Button variant="outline" size="lg" className="border-violet-200 hover:border-violet-300 hover:bg-violet-50 text-violet-600">
              Carregar mais artigos
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center text-white">
            <h2 className="text-3xl font-bold">Receba nossos artigos por email</h2>
            <p className="mt-4 text-violet-100">
              Assine nossa newsletter e receba conteudo exclusivo sobre gestao de clinicas odontologicas.
            </p>
            <div className="mt-8 flex gap-2 mx-auto max-w-md">
              <Input
                placeholder="seu@email.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20"
              />
              <Button className="bg-white hover:bg-white/90 text-violet-600 font-semibold">
                Assinar
              </Button>
            </div>
            <p className="mt-4 text-xs text-violet-200">
              Sem spam. Cancele quando quiser.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
