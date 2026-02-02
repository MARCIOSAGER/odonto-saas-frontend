"use client"
import { useEffect } from "react"
import { usePlatformBranding } from "@/hooks/usePlatformBranding"
import { hexToHsl } from "@/lib/colors"
import { getUploadUrl } from "@/lib/api"

/**
 * Injects branding CSS variables (--primary, --ring) onto document.documentElement
 * and updates the favicon dynamically. Renders nothing visually.
 */
export function BrandingCSSInjector() {
  const { branding } = usePlatformBranding()

  useEffect(() => {
    if (!branding.primaryColor) return

    const hsl = hexToHsl(branding.primaryColor)
    document.documentElement.style.setProperty("--primary", hsl)
    document.documentElement.style.setProperty("--ring", hsl)

    return () => {
      document.documentElement.style.removeProperty("--primary")
      document.documentElement.style.removeProperty("--ring")
    }
  }, [branding.primaryColor])

  // Dynamic favicon
  useEffect(() => {
    if (!branding.faviconUrl && !branding.logoUrl) return

    const iconUrl = branding.faviconUrl || branding.logoUrl
    const fullUrl = getUploadUrl(iconUrl)
    if (!fullUrl) return

    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null
    if (link) {
      link.href = fullUrl
    } else {
      link = document.createElement("link")
      link.rel = "icon"
      link.href = fullUrl
      document.head.appendChild(link)
    }
  }, [branding.faviconUrl, branding.logoUrl])

  return null
}
