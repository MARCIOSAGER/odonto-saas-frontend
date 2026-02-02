"use client"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import axios from "axios"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

const publicApi = axios.create({ baseURL: API_BASE })

export interface ResolvedBranding {
  name: string
  description: string
  logoUrl: string
  faviconUrl: string
  primaryColor: string
  secondaryColor: string
  heroTitle: string
  heroSubtitle: string
  isClinicBranding: boolean
  clinicSlug: string | null
}

const DEFAULTS: ResolvedBranding = {
  name: "Odonto SaaS",
  description: "Sistema completo para gestão de clínicas odontológicas",
  logoUrl: "",
  faviconUrl: "",
  primaryColor: "#0EA5E9",
  secondaryColor: "#10B981",
  heroTitle: "Gestão completa para sua clínica odontológica",
  heroSubtitle: "Agenda, prontuários, financeiro, WhatsApp e inteligência artificial em uma única plataforma. Tudo que você precisa para crescer.",
  isClinicBranding: false,
  clinicSlug: null,
}

export function usePlatformBranding() {
  const searchParams = useSearchParams()
  const clinicSlug = searchParams?.get("clinic") || null

  const platformQuery = useQuery({
    queryKey: ["platform-branding"],
    queryFn: async () => {
      const res = await publicApi.get("/api/v1/system-config/public")
      return (res.data?.data || res.data) as Record<string, string>
    },
    staleTime: 30 * 1000,
    retry: 1,
  })

  const clinicQuery = useQuery({
    queryKey: ["clinic-branding-public", clinicSlug],
    queryFn: async () => {
      const res = await publicApi.get(`/api/v1/clinics/public/branding/${clinicSlug}`)
      return (res.data?.data || res.data) as {
        id: string
        name: string
        slug: string
        logo_url: string | null
        favicon_url: string | null
        primary_color: string | null
        secondary_color: string | null
        slogan: string | null
        tagline: string | null
      }
    },
    enabled: !!clinicSlug,
    staleTime: 30 * 1000,
    retry: 1,
  })

  const platform = platformQuery.data
  const clinic = clinicQuery.data

  const branding: ResolvedBranding = {
    name: clinic?.name || platform?.platform_name || DEFAULTS.name,
    description: clinic?.tagline || platform?.platform_description || DEFAULTS.description,
    logoUrl: clinic?.logo_url || platform?.platform_logo_url || DEFAULTS.logoUrl,
    faviconUrl: clinic?.favicon_url || platform?.platform_favicon_url || DEFAULTS.faviconUrl,
    primaryColor: clinic?.primary_color || platform?.platform_primary_color || DEFAULTS.primaryColor,
    secondaryColor: clinic?.secondary_color || platform?.platform_secondary_color || DEFAULTS.secondaryColor,
    heroTitle: platform?.platform_hero_title || DEFAULTS.heroTitle,
    heroSubtitle: platform?.platform_hero_subtitle || DEFAULTS.heroSubtitle,
    isClinicBranding: !!clinic,
    clinicSlug,
  }

  return {
    branding,
    isLoading: platformQuery.isLoading || (!!clinicSlug && clinicQuery.isLoading),
  }
}
