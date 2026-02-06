"use client"
import { Hero } from "@/components/marketing/hero"
import { SocialProof } from "@/components/marketing/social-proof"
import { Features } from "@/components/marketing/features"
import { PricingSection } from "@/components/marketing/pricing-section"
import { Faq } from "@/components/marketing/faq"
import { Cta } from "@/components/marketing/cta"

export default function LandingPage() {
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
