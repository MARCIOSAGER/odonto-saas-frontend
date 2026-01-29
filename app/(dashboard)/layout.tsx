"use client"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useEffect } from "react"
import { useClinic } from "@/hooks/useClinic"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { clinic } = useClinic()

  useEffect(() => {
    if (clinic) {
      if (clinic.primary_color) {
        document.documentElement.style.setProperty('--primary', clinic.primary_color)
      }
      if (clinic.secondary_color) {
        document.documentElement.style.setProperty('--secondary', clinic.secondary_color)
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
