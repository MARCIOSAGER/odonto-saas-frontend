"use client"
import { Search, Plus, Calendar, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MobileNav } from "./mobile-nav"
import { NotificationBell } from "@/components/notifications/notification-bell"

export function Header() {
  const t = useTranslations("header")
  const router = useRouter()

  const handleNewAppointment = () => {
    router.push("/appointments?new=true")
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 md:px-6 backdrop-blur-md">
      <div className="flex flex-1 items-center gap-4">
        <MobileNav />
        <button
          onClick={() => {
            const event = new KeyboardEvent("keydown", { key: "k", metaKey: true })
            document.dispatchEvent(event)
          }}
          className="relative w-full max-w-md hidden md:flex items-center gap-2 h-10 px-3 rounded-lg bg-muted/40 text-sm text-muted-foreground hover:bg-muted/60 transition-colors"
        >
          <Search className="h-4 w-4" />
          <span>{t("searchPlaceholder")}</span>
          <kbd className="ml-auto pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex gap-2 font-medium"
          onClick={handleNewAppointment}
        >
          <Plus size={16} />
          {t("newAppointment")}
        </Button>

        <div className="h-8 w-px bg-border mx-2 hidden sm:block" />

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/appointments")}
          title={t("calendar")}
        >
          <Calendar size={20} />
        </Button>

        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" title={t("help")}>
              <HelpCircle size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              {t("settings")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/docs")}>
              {t("docs")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              {t("support")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
