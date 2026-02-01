import { PricingTable } from "@/components/marketing/pricing-table"
import { Faq } from "@/components/marketing/faq"
import { Cta } from "@/components/marketing/cta"

export const metadata = {
  title: "Preços | Odonto SaaS",
  description: "Planos simples e transparentes para clínicas odontológicas de todos os tamanhos.",
}

export default function PricingPage() {
  return (
    <>
      <PricingTable />
      <Faq />
      <Cta />
    </>
  )
}
