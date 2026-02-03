import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Planos e Preços",
  description:
    "Conheça os planos do Odonto SaaS: do gratuito ao profissional. Agenda, odontograma digital, prontuário com IA, WhatsApp e relatórios. Teste grátis por 14 dias.",
  openGraph: {
    title: "Planos e Preços — Odonto SaaS",
    description:
      "Conheça os planos do Odonto SaaS: do gratuito ao profissional. Teste grátis por 14 dias.",
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
