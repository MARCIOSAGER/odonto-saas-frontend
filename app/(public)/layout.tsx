"use client"
import { Suspense } from "react"
import { Navbar } from "@/components/marketing/navbar"
import { Footer } from "@/components/marketing/footer"
import { BrandingCSSInjector } from "@/components/branding-css-injector"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={null}>
        <BrandingCSSInjector />
      </Suspense>
      <Suspense fallback={<div className="h-16 border-b bg-background" />}>
        <Navbar />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Suspense fallback={<div className="border-t bg-muted/30 py-12" />}>
        <Footer />
      </Suspense>
    </div>
  )
}
