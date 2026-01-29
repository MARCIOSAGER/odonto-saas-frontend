"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"
import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/toast"
import { BrandingProvider } from "@/components/providers/branding-provider"

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        <QueryClientProvider client={queryClient}>
          <BrandingProvider>
            <Toaster position="top-right" />
            {children}
          </BrandingProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
