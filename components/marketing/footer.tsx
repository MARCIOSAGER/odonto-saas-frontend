"use client"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Sparkles, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  const t = useTranslations("marketing")

  return (
    <footer className="border-t bg-slate-50">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                INTER-IA
              </span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs mb-6">
              Software de gestao completo para clinicas odontologicas. Agenda, prontuario com IA, financeiro e WhatsApp integrado.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-violet-500" />
                <span>contato@inter-ia.com.br</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-violet-500" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-violet-500" />
                <span>Sao Paulo, Brasil</span>
              </div>
            </div>
          </div>

          {/* Produto */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">{t("footerProduct")}</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/#features" className="hover:text-violet-600 transition-colors">{t("features")}</Link></li>
              <li><Link href="/pricing" className="hover:text-violet-600 transition-colors">{t("prices")}</Link></li>
              <li><Link href="/#faq" className="hover:text-violet-600 transition-colors">{t("faq")}</Link></li>
              <li><Link href="/blog" className="hover:text-violet-600 transition-colors">Blog</Link></li>
              <li><Link href="/cases" className="hover:text-violet-600 transition-colors">Cases</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">{t("footerLegal")}</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/terms" className="hover:text-violet-600 transition-colors">{t("footerTerms")}</Link></li>
              <li><Link href="/privacy" className="hover:text-violet-600 transition-colors">{t("footerPrivacy")}</Link></li>
              <li><Link href="/lgpd" className="hover:text-violet-600 transition-colors">LGPD</Link></li>
            </ul>
          </div>

          {/* Conta */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">{t("footerAccount")}</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/login" className="hover:text-violet-600 transition-colors">{t("footerSignIn")}</Link></li>
              <li><Link href="/register" className="hover:text-violet-600 transition-colors">{t("footerCreateAccount")}</Link></li>
              <li><Link href="/forgot-password" className="hover:text-violet-600 transition-colors">Recuperar senha</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} INTER-IA. {t("footerRights")}
          </p>
          <div className="flex items-center gap-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-violet-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-violet-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-violet-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
