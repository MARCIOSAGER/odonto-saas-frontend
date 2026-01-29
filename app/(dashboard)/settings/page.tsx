"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Moon, Monitor } from "lucide-react"

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evitar hydration mismatch - OBRIGATÓRIO
  useEffect(() => {
    setMounted(true)
  }, [])

  // Não renderizar até montar (evita flash)
  if (!mounted) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Configurações</h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Aparência</CardTitle>
            <CardDescription className="text-muted-foreground">Carregando...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Configurações</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Aparência</CardTitle>
          <CardDescription className="text-muted-foreground">
            Tema atual: {resolvedTheme === "dark" ? "Escuro" : "Claro"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant={theme === "light" ? "default" : "outline"} 
              onClick={() => setTheme("light")} 
              className="flex items-center gap-2"
            >
              <Sun className="h-4 w-4" />
              Modo Claro
            </Button>
            
            <Button 
              variant={theme === "dark" ? "default" : "outline"} 
              onClick={() => setTheme("dark")} 
              className="flex items-center gap-2"
            >
              <Moon className="h-4 w-4" />
              Modo Escuro
            </Button>
            
            <Button 
              variant={theme === "system" ? "default" : "outline"} 
              onClick={() => setTheme("system")} 
              className="flex items-center gap-2"
            >
              <Monitor className="h-4 w-4" />
              Sistema
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
