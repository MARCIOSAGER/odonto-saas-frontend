"use client"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { usePlatformBranding } from "@/hooks/usePlatformBranding"
import { getUploadUrl } from "@/lib/api"

export function Footer() {
  const { branding } = usePlatformBranding()
  const t = useTranslations("marketing")

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
              {branding.logoUrl ? (
                <img src={getUploadUrl(branding.logoUrl)} alt={branding.name} className="h-7 w-7 rounded-lg object-contain" />
              ) : (
                <div className="p-1.5 rounded-lg" style={{ backgroundColor: branding.primaryColor }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="white"/>
                  </svg>
                </div>
              )}
              <span>{branding.name}</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              {branding.description || t("footerDescription")}
            </p>
          </div>

          {/* Produto */}
          <div>
            <h4 className="text-sm font-semibold mb-3">{t("footerProduct")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#features" className="hover:text-foreground transition-colors">{t("features")}</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">{t("prices")}</Link></li>
              <li><Link href="/#faq" className="hover:text-foreground transition-colors">{t("faq")}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-3">{t("footerLegal")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-foreground transition-colors">{t("footerTerms")}</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">{t("footerPrivacy")}</Link></li>
            </ul>
          </div>

          {/* Conta */}
          <div>
            <h4 className="text-sm font-semibold mb-3">{t("footerAccount")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/login" className="hover:text-foreground transition-colors">{t("footerSignIn")}</Link></li>
              <li><Link href="/register" className="hover:text-foreground transition-colors">{t("footerCreateAccount")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {branding.name}. {t("footerRights")}
        </div>
      </div>
    </footer>
  )
}
