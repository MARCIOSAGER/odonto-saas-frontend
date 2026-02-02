"use client"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Dashboard error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6">
      <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Algo deu errado</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Ocorreu um erro inesperado ao carregar esta página. Tente novamente ou volte para o dashboard.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => (window.location.href = "/home")}>
          Ir para Dashboard
        </Button>
        <Button onClick={() => reset()}>
          Tentar novamente
        </Button>
      </div>
    </div>
  )
}
