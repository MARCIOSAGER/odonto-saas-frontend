"use client"
import { Suspense } from "react"
import { Navbar } from "@/components/marketing/navbar"
import { Footer } from "@/components/marketing/footer"
import { BrandingCSSInjector } from "@/components/providers/branding-css-injector"

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "INTER-IA",
  description: "Software de gestão completo para clínicas odontológicas",
  url: "https://odonto.marciosager.com",
  logo: "https://odonto.marciosager.com/icons/icon-512x512.png",
  contactPoint: {
    "@type": "ContactPoint",
    email: "contato@marciosager.com",
    contactType: "customer service",
    availableLanguage: "Portuguese",
  },
}

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "INTER-IA",
  description: "Software odontológico completo: agenda, odontograma digital, prontuário com IA, WhatsApp integrado, receituário e relatórios.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "BRL",
    description: "Plano gratuito disponível. Teste premium por 14 dias sem cartão.",
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Preciso instalar algum software?",
      acceptedAnswer: { "@type": "Answer", text: "Não. A plataforma é 100% online e funciona em qualquer navegador. Você também pode instalar como app no celular (PWA)." },
    },
    {
      "@type": "Question",
      name: "O plano grátis tem limitação de tempo?",
      acceptedAnswer: { "@type": "Answer", text: "O plano Básico é gratuito para sempre com até 50 pacientes e 2 dentistas. Para funcionalidades avançadas, faça upgrade a qualquer momento." },
    },
    {
      "@type": "Question",
      name: "Meus dados ficam seguros?",
      acceptedAnswer: { "@type": "Answer", text: "Sim. Criptografia em trânsito e em repouso, 2FA, controle de acesso por perfil e conformidade com a LGPD." },
    },
    {
      "@type": "Question",
      name: "Posso cancelar a qualquer momento?",
      acceptedAnswer: { "@type": "Answer", text: "Sim. Sem fidelidade ou multa. Downgrade ou cancelamento a qualquer momento." },
    },
    {
      "@type": "Question",
      name: "Como funciona a integração com WhatsApp?",
      acceptedAnswer: { "@type": "Answer", text: "Integração via Z-API. Conecte seu número e envie lembretes e mensagens automáticas para pacientes." },
    },
    {
      "@type": "Question",
      name: "A inteligência artificial substitui o dentista?",
      acceptedAnswer: { "@type": "Answer", text: "Não. A IA é ferramenta de apoio para prontuários, planos de tratamento e resumos. Decisão clínica é sempre do profissional." },
    },
  ],
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
