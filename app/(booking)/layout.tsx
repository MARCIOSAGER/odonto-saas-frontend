"use client"

import { Suspense } from "react"

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Carregando...</div>}>
        {children}
      </Suspense>
    </div>
  )
}
