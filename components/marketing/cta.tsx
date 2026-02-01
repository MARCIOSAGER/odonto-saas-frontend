import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Cta() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="relative rounded-2xl bg-gradient-to-br from-sky-600 via-sky-700 to-blue-900 p-10 md:p-16 text-center text-white overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-60 h-60 bg-sky-400/20 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Pronto para modernizar sua clínica?
            </h2>
            <p className="text-lg text-white/90">
              Junte-se a milhares de profissionais que já simplificaram sua gestão.
              Comece seu teste grátis de 14 dias agora.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="h-12 px-8 text-base font-semibold bg-white text-sky-700 hover:bg-white/90 group"
              >
                Criar minha conta grátis
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
