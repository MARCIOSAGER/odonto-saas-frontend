import "./globals.css"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Plus_Jakarta_Sans } from "next/font/google"
import { Metadata, Viewport } from "next"
import { Providers } from "@/components/providers"
import { Toaster } from "sonner"

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" })

export const viewport: Viewport = {
  themeColor: "#0284c7",
}

export const metadata: Metadata = {
  title: "Odonto SaaS",
  description: "Sistema completo para gestão de clínicas odontológicas",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${jakarta.variable} font-jakarta`}>
        <Providers>{children}</Providers>
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
