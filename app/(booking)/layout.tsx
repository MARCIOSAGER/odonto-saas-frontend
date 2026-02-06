"use client"

import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-violet-50/30 to-indigo-50/50">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
              <p className="text-sm text-gray-500">Carregando...</p>
            </div>
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  )
}
