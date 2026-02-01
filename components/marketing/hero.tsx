import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Users } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-background to-blue-50 dark:from-sky-950/20 dark:via-background dark:to-blue-950/20" />
      <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-[500px] h-[500px] bg-sky-200/30 dark:bg-sky-800/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[400px] h-[400px] bg-blue-200/20 dark:bg-blue-800/10 rounded-full blur-3xl" />

      <div className="container relative z-10 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 px-4 py-1.5 rounded-full text-sm font-medium">
            <Zap className="h-3.5 w-3.5" />
            14 dias grátis &mdash; sem cartão de crédito
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Gestão completa para sua{" "}
            <span className="text-sky-600 dark:text-sky-400">clínica odontológica</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Agenda, prontuários, financeiro, WhatsApp e inteligência artificial em uma
            única plataforma. Tudo que você precisa para crescer.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-base font-semibold group">
                Começar teste grátis
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                Ver planos e preços
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Dados criptografados</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-sky-600" />
              <span>+2.000 profissionais</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Setup em 5 minutos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
