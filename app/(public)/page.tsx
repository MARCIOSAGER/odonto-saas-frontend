import { Hero } from "@/components/marketing/hero"
import { Features } from "@/components/marketing/features"
import { PricingTable } from "@/components/marketing/pricing-table"
import { Faq } from "@/components/marketing/faq"
import { Cta } from "@/components/marketing/cta"

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <PricingTable />
      <Faq />
      <Cta />
    </>
  )
}
