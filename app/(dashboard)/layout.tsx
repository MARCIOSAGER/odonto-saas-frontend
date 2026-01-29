"use client"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useEffect } from "react"
import { useClinic } from "@/hooks/useClinic"
import { hexToHsl } from "@/lib/colors"

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
