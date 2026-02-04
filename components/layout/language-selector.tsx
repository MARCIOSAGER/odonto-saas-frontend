"use client"
import { useLocale } from "next-intl"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const LOCALES = [
  { code: "pt-BR", label: "Português (BR)", short: "PT" },
  { code: "en", label: "English", short: "EN" },
] as const

export function LanguageSelector() {
  const currentLocale = useLocale()

  const handleLocaleChange = (locale: string) => {
    document.cookie = `locale=${locale};path=/;max-age=31536000;SameSite=Lax`
    window.location.reload()
  }

  const current = LOCALES.find((l) => l.code === currentLocale) || LOCALES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <Globe size={16} />
          <span className="text-xs">{current.short}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => handleLocaleChange(locale.code)}
            className={currentLocale === locale.code ? "bg-accent font-medium" : ""}
          >
            {locale.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
