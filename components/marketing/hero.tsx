"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Users } from "lucide-react"
import { useTranslations } from "next-intl"
import { usePlatformBranding } from "@/hooks/usePlatformBranding"
import { adjustBrightness } from "@/lib/colors"

export function Hero() {
  const { branding } = usePlatformBranding()
  const t = useTranslations("marketing")

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom right, ${branding.primaryColor}08, transparent, ${branding.primaryColor}06)`,
        }}
      />
      <div
        className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{ backgroundColor: `${branding.primaryColor}12` }}
      />
      <div
        className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[400px] h-[400px] rounded-full blur-3xl"
        style={{ backgroundColor: `${branding.primaryColor}0A` }}
      />

      <div className="container relative z-10 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium"
            style={{ backgroundColor: `${branding.primaryColor}15`, color: branding.primaryColor }}
          >
            <Zap className="h-3.5 w-3.5" />
            {t("trialBadge")}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            {branding.heroTitle}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {branding.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-base font-semibold group">
                {t("startFreeTrial")}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                {t("viewPlans")}
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-green-600" />
              <span>{t("encryptedData")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" />
              <span>{t("professionals")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>{t("quickSetup")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
