"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X, ChevronDown, CalendarDays, FileText, BarChart3, Megaphone, Brain } from "lucide-react"
import { useTranslations } from "next-intl"

const modules = [
  { key: "agenda", icon: CalendarDays, href: "/#features" },
  { key: "prontuario", icon: FileText, href: "/#features" },
  { key: "financeiro", icon: BarChart3, href: "/#features" },
  { key: "marketing", icon: Megaphone, href: "/#features" },
  { key: "ia", icon: Brain, href: "/#features" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const t = useTranslations("marketing")

  return (
    <header className="sticky top-0 z-50 w-full bg-[#3B82F6] shadow-lg">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
          <div className="p-1.5 rounded-lg bg-white/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="white"/>
            </svg>
          </div>
          <span>INTER-IA</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Funcionalidades Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setFeaturesOpen(true)}
            onMouseLeave={() => setFeaturesOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white transition-colors">
              {t("features")}
              <ChevronDown className={`h-4 w-4 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {featuresOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {modules.map((mod) => (
                  <Link
                    key={mod.key}
                    href={mod.href}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setFeaturesOpen(false)}
                  >
                    <mod.icon className="h-4 w-4" />
                    <span>{t(`module${mod.key.charAt(0).toUpperCase() + mod.key.slice(1)}`)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/pricing" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
            {t("prices")}
          </Link>
          <Link href="/blog" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
            Blog
          </Link>
          <Link href="/cases" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
            Cases e Clientes
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="border-white/50 text-white bg-transparent hover:bg-white/10 hover:text-white"
            >
              {t("signIn")}
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="sm"
              className="bg-amber-400 hover:bg-amber-500 text-black font-semibold shadow-lg"
            >
              {t("startFree")}
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-[#2563EB] px-4 py-4 space-y-3 border-t border-white/10">
          {/* Mobile Funcionalidades */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">{t("features")}</p>
            {modules.map((mod) => (
              <Link
                key={mod.key}
                href={mod.href}
                className="flex items-center gap-3 py-2 text-sm text-white/80"
                onClick={() => setMobileOpen(false)}
              >
                <mod.icon className="h-4 w-4" />
                <span>{t(`module${mod.key.charAt(0).toUpperCase() + mod.key.slice(1)}`)}</span>
              </Link>
            ))}
          </div>

          <div className="border-t border-white/10 pt-3 space-y-2">
            <Link
              href="/pricing"
              className="block text-sm font-medium text-white/90"
              onClick={() => setMobileOpen(false)}
            >
              {t("prices")}
            </Link>
            <Link
              href="/blog"
              className="block text-sm font-medium text-white/90"
              onClick={() => setMobileOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/cases"
              className="block text-sm font-medium text-white/90"
              onClick={() => setMobileOpen(false)}
            >
              Cases e Clientes
            </Link>
          </div>

          <div className="flex gap-2 pt-3 border-t border-white/10">
            <Link href="/login" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-white/50 text-white bg-transparent hover:bg-white/10"
                size="sm"
              >
                {t("signIn")}
              </Button>
            </Link>
            <Link href="/register" className="flex-1">
              <Button
                className="w-full bg-amber-400 hover:bg-amber-500 text-black font-semibold"
                size="sm"
              >
                {t("startFree")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
