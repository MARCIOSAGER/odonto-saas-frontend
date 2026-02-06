"use client"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { CommandPalette } from "@/components/command-palette/command-palette"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useClinic } from "@/hooks/useClinic"
import { useNotificationSocket } from "@/hooks/useNotificationSocket"
import { hexToHsl } from "@/lib/colors"
import { getUploadUrl } from "@/lib/api"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status: sessionStatus } = useSession()
  const { clinic, isLoading: isLoadingClinic } = useClinic()
  const pathname = usePathname()
  const router = useRouter()

  // Socket.IO for real-time notifications
  useNotificationSocket()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login")
    }
  }, [sessionStatus, router])

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (clinic && clinic.onboarding_completed === false && !pathname.startsWith("/onboarding")) {
      router.push("/onboarding")
    }
  }, [clinic, pathname, router])

  // Apply clinic branding (colors, title, favicon)
  useEffect(() => {
    if (clinic) {
      if (clinic.primary_color) {
        try {
          const hsl = hexToHsl(clinic.primary_color)
          document.documentElement.style.setProperty('--primary', hsl)
        } catch (e) {
          console.error("Erro ao converter cor primária:", e)
        }
      }
      if (clinic.secondary_color) {
        try {
          const hsl = hexToHsl(clinic.secondary_color)
          document.documentElement.style.setProperty('--secondary', hsl)
        } catch (e) {
          console.error("Erro ao converter cor secundária:", e)
        }
      }

      // Título dinâmico da aba do browser
      if (clinic.name) {
        document.title = clinic.name
      }

      // Favicon dinâmico da clínica (sobrescreve o favicon padrão da plataforma)
      try {
        if (clinic.favicon_url || clinic.logo_url) {
          const faviconUrl = getUploadUrl(clinic.favicon_url || clinic.logo_url)
          if (faviconUrl && faviconUrl.startsWith('http')) {
            const existing = document.querySelector("link[rel='icon']") as HTMLLinkElement
            if (existing) {
              existing.href = faviconUrl
            } else {
              const newLink = document.createElement('link')
              newLink.rel = 'icon'
              newLink.href = faviconUrl
              document.head.appendChild(newLink)
            }
          }
        }
      } catch (e) {
        console.error("Erro ao atualizar favicon:", e)
      }
    }
  }, [clinic])

  // Show loading state while session or clinic data is being fetched
  if (sessionStatus === "loading" || (sessionStatus === "authenticated" && isLoadingClinic)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  // Don't render dashboard if not authenticated
  if (sessionStatus === "unauthenticated") {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1">
        <Header />
        <main className="container py-4 md:py-6">{children}</main>
      </div>
      <CommandPalette />
    </div>
  )
}
