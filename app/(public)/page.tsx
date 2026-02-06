"use client"
import { Suspense } from "react"
import { Hero } from "@/components/marketing/hero"
import { SocialProof } from "@/components/marketing/social-proof"
import { Features } from "@/components/marketing/features"
import { PricingSection } from "@/components/marketing/pricing-section"
import { Faq } from "@/components/marketing/faq"
import { Cta } from "@/components/marketing/cta"

function LandingContent() {
  return (
    <>
      <Hero />
      <SocialProof />
      <Features />
      <PricingSection />
      <Faq />
      <Cta />
    </>
  )
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
      <LandingContent />
    </Suspense>
  )
}
