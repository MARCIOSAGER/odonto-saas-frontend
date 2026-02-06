"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"

export function Cta() {
  const t = useTranslations("marketing")

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="relative rounded-3xl p-10 md:p-16 text-center text-white overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-violet-500/10 to-transparent rounded-full" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Comece em menos de 5 minutos</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {t("ctaTitle")}
            </h2>
            <p className="text-lg md:text-xl text-white/90 max-w-xl mx-auto">
              {t("ctaDescription")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-14 px-8 text-base font-semibold bg-white hover:bg-white/90 text-violet-600 shadow-xl shadow-black/10 group"
                >
                  {t("ctaButton")}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base font-medium border-2 border-white/30 bg-white/5 hover:bg-white/10 text-white"
                >
                  Ver planos
                </Button>
              </Link>
            </div>

            {/* Trust indicator */}
            <p className="text-sm text-white/70 pt-4">
              Sem cartao de credito. Cancele quando quiser.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
