"use client"
import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useSession } from "next-auth/react"

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  const { data: clinic } = useQuery({
    queryKey: ["clinic-branding", (session?.user as any)?.clinic_id],
    queryFn: async () => {
      const res = await api.get(`/auth/me`)
      return res.data?.data
    },
    enabled: !!session
  })

  useEffect(() => {
    if (clinic?.primary_color) {
      document.documentElement.style.setProperty('--primary', clinic.primary_color)
      // Gerar uma cor de destaque com opacidade para anéis de foco, etc
      document.documentElement.style.setProperty('--primary-ring', `${clinic.primary_color}33`)
    }
    if (clinic?.secondary_color) {
      document.documentElement.style.setProperty('--secondary', clinic.secondary_color)
    }
  }, [clinic])

  return <>{children}</>
}
