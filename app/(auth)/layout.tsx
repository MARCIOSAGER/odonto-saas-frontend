"use client"
import { Suspense } from "react"
import { BrandingCSSInjector } from "@/components/providers/branding-css-injector"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <BrandingCSSInjector />
      </Suspense>
      {children}
    </>
  )
}
