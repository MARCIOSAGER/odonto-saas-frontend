"use client"
import { Suspense } from "react"
import { PricingTable } from "@/components/marketing/pricing-table"
import { Faq } from "@/components/marketing/faq"
import { Cta } from "@/components/marketing/cta"

function PricingContent() {
  return (
    <>
      <PricingTable />
      <Faq />
      <Cta />
    </>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
      <PricingContent />
    </Suspense>
  )
}
