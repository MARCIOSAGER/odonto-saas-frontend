"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"
import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "sonner"
import { BrandingProvider } from "@/components/providers/branding-provider"

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <SessionProvider>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem 
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <BrandingProvider>
            <Toaster richColors position="top-right" />
            {children}
          </BrandingProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
