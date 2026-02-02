"use client"
import Link from "next/link"
import { usePlatformBranding } from "@/hooks/usePlatformBranding"
import { getUploadUrl } from "@/lib/api"

export function Footer() {
  const { branding } = usePlatformBranding()

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
              {branding.description || "A plataforma completa para gestão de clínicas odontológicas."}
            </p>
          </div>

          {/* Produto */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Produto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#features" className="hover:text-foreground transition-colors">Funcionalidades</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Preços</Link></li>
              <li><Link href="/#faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Termos de Uso</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacidade</Link></li>
            </ul>
          </div>

          {/* Conta */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Conta</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/login" className="hover:text-foreground transition-colors">Entrar</Link></li>
              <li><Link href="/register" className="hover:text-foreground transition-colors">Criar conta</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {branding.name}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
