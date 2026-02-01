"use client"

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center max-w-md space-y-4">
        <div className="text-6xl">📡</div>
        <h1 className="text-2xl font-bold">Sem conexão</h1>
        <p className="text-muted-foreground">
          Você está sem acesso à internet. Verifique sua conexão e tente novamente.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  )
}
