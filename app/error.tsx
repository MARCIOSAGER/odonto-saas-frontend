"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-background">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-6">
        <AlertTriangle size={40} />
      </div>
      <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Algo deu errado</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Ocorreu um erro inesperado. Por favor, tente recarregar a página ou entre em contato com o suporte se o problema persistir.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} size="lg">
          Tentar novamente
        </Button>
        <Button variant="outline" onClick={() => window.location.href = "/home"} size="lg">
          Voltar ao Início
        </Button>
      </div>
      {process.env.NODE_ENV === "development" && (
        <pre className="mt-8 p-4 rounded-lg bg-muted text-left text-xs overflow-auto max-w-2xl w-full">
          {error.message}
          {error.stack}
        </pre>
      )}
    </div>
  )
}
