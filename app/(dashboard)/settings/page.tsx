"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Moon, Monitor } from "lucide-react"
import { useTranslations } from "next-intl"

export default function SettingsPage() {
  const t = useTranslations("settingsGeneral")
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-foreground">{t("title")}</h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">{t("appearance")}</CardTitle>
            <CardDescription className="text-muted-foreground">{t("loading")}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-foreground">{t("title")}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">{t("appearance")}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {t("currentTheme", { theme: resolvedTheme === "dark" ? t("themeDark") : t("themeLight") })}
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
              {t("lightMode")}
            </Button>

            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
              className="flex items-center gap-2"
            >
              <Moon className="h-4 w-4" />
              {t("darkMode")}
            </Button>

            <Button
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => setTheme("system")}
              className="flex items-center gap-2"
            >
              <Monitor className="h-4 w-4" />
              {t("system")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
