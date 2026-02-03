import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://odontosaas.com.br"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/appointments",
        "/patients",
        "/dentists",
        "/settings",
        "/conversations",
        "/reports",
        "/admin",
        "/home",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
