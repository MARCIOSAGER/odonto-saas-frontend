import "./globals.css"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Plus_Jakarta_Sans } from "next/font/google"
import { Metadata, Viewport } from "next"
import { Providers } from "@/components/providers"
import { Toaster } from "sonner"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" })

export const viewport: Viewport = {
  themeColor: "#0284c7",
}

import { env } from "@/lib/env"

const siteUrl = env.siteUrl
const description = "Software odontológico completo: agenda, odontograma digital, prontuário com IA, WhatsApp integrado, receituário e relatórios. Teste grátis por 14 dias."

export const metadata: Metadata = {
  title: {
    default: "Odonto SaaS — Gestão de Clínicas Odontológicas",
    template: "%s | Odonto SaaS",
  },
  description,
  keywords: [
    "software odontológico",
    "gestão de clínica odontológica",
    "odontograma digital",
    "prontuário eletrônico odontológico",
    "agenda dentista",
    "sistema para dentista",
    "SaaS odontológico",
    "receituário digital",
    "WhatsApp clínica",
  ],
  authors: [{ name: "Odonto SaaS" }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Odonto SaaS",
    title: "Odonto SaaS — Gestão de Clínicas Odontológicas",
    description,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Odonto SaaS — Gestão de Clínicas Odontológicas",
    description,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/icons/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Odonto SaaS",
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${jakarta.variable} font-jakarta`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
        <Toaster position="top-right" richColors closeButton />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
