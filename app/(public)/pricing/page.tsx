"use client"
import { PricingTable } from "@/components/marketing/pricing-table"
import { Faq } from "@/components/marketing/faq"
import { Cta } from "@/components/marketing/cta"

export default function PricingPage() {
  return (
    <>
      <PricingTable />
      <Faq />
      <Cta />
    </>
  )
}
