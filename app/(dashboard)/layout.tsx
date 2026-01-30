"use client"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useEffect } from "react"
import { useClinic } from "@/hooks/useClinic"
import { hexToHsl } from "@/lib/colors"
import { getUploadUrl } from "@/lib/api"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { clinic } = useClinic()

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

      // Favicon dinâmico
      if (clinic.favicon_url || clinic.logo_url) {
        const faviconUrl = getUploadUrl(clinic.favicon_url || clinic.logo_url)
        const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement
        if (link) {
          link.href = faviconUrl
        } else {
          const newLink = document.createElement('link')
          newLink.rel = 'icon'
          newLink.href = faviconUrl
          document.head.appendChild(newLink)
        }
      }
    }
  }, [clinic])

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1">
        <Header />
        <main className="container py-6">{children}</main>
      </div>
    </div>
  )
}
