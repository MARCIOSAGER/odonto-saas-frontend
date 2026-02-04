import type { MetadataRoute } from "next"
import { env } from "@/lib/env"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.siteUrl

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
