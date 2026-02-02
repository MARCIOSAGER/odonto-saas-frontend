"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { usePlatformBranding } from "@/hooks/usePlatformBranding"
import { getUploadUrl } from "@/lib/api"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { branding } = usePlatformBranding()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          {branding.logoUrl ? (
            <img src={getUploadUrl(branding.logoUrl)} alt={branding.name} className="h-8 w-8 rounded-lg object-contain" />
          ) : (
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: branding.primaryColor }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="white"/>
              </svg>
            </div>
          )}
          <span>{branding.name}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Funcionalidades
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Preços
          </Link>
          <Link href="/#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Entrar</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Começar grátis</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-3">
          <Link
            href="/#features"
            className="block text-sm font-medium text-muted-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Funcionalidades
          </Link>
          <Link
            href="/pricing"
            className="block text-sm font-medium text-muted-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Preços
          </Link>
          <Link
            href="/#faq"
            className="block text-sm font-medium text-muted-foreground"
            onClick={() => setMobileOpen(false)}
          >
            FAQ
          </Link>
          <div className="flex gap-2 pt-2">
            <Link href="/login" className="flex-1">
              <Button variant="outline" className="w-full" size="sm">Entrar</Button>
            </Link>
            <Link href="/register" className="flex-1">
              <Button className="w-full" size="sm">Começar grátis</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
