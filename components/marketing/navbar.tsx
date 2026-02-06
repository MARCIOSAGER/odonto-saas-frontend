"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X, Sparkles, Play } from "lucide-react"
import { useTranslations } from "next-intl"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = useTranslations("marketing")

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            INTER-IA
          </span>
        </Link>

        {/* Desktop nav - centered */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Produto
          </Link>
          <Link href="/#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Como Funciona
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            {t("prices")}
          </Link>
          <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Recursos
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              {t("signIn")}
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="sm"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-lg shadow-violet-500/25"
            >
              <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
              Começar Grátis
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          <Link
            href="/#features"
            className="block py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900"
            onClick={() => setMobileOpen(false)}
          >
            Produto
          </Link>
          <Link
            href="/#how-it-works"
            className="block py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900"
            onClick={() => setMobileOpen(false)}
          >
            Como Funciona
          </Link>
          <Link
            href="/pricing"
            className="block py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900"
            onClick={() => setMobileOpen(false)}
          >
            {t("prices")}
          </Link>
          <Link
            href="/blog"
            className="block py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900"
            onClick={() => setMobileOpen(false)}
          >
            Recursos
          </Link>

          <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
            <Link href="/login">
              <Button
                variant="outline"
                className="w-full"
                size="sm"
              >
                {t("signIn")}
              </Button>
            </Link>
            <Link href="/register">
              <Button
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                size="sm"
              >
                <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
