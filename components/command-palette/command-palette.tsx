"use client"
import { useEffect, useState, useCallback, useRef } from "react"
import { Command } from "cmdk"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { api } from "@/lib/api"
import {
  CalendarDays,
  Users,
  UserPlus,
  Stethoscope,
  Settings,
  Home,
  Search,
  FileText,
  MessageSquare,
  CreditCard,
  ArrowRight,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  Loader2,
  Sparkles,
} from "lucide-react"

interface SearchResult {
  id: string
  name: string
  type: "patient" | "dentist"
  subtitle?: string
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const t = useTranslations("commandPalette")
  const tNav = useTranslations("nav")
  const inputRef = useRef<HTMLInputElement>(null)

  const NAVIGATION_ITEMS = [
    { label: tNav("dashboard"), href: "/home", icon: Home, color: "text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-950" },
    { label: tNav("appointments"), href: "/appointments", icon: CalendarDays, color: "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950" },
    { label: tNav("patients"), href: "/patients", icon: Users, color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950" },
    { label: tNav("dentists"), href: "/dentists", icon: Stethoscope, color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950" },
    { label: tNav("services"), href: "/services", icon: FileText, color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950" },
    { label: tNav("conversations"), href: "/conversations", icon: MessageSquare, color: "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950" },
    { label: tNav("settings"), href: "/settings", icon: Settings, color: "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900" },
    { label: tNav("billing"), href: "/settings/billing", icon: CreditCard, color: "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950" },
  ]

  const ACTION_ITEMS = [
    { label: t("newPatient"), href: "/patients?new=true", icon: UserPlus, color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950" },
    { label: t("newAppointment"), href: "/appointments?new=true", icon: CalendarDays, color: "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950" },
  ]

  // Global keyboard shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setSearch("")
      setResults([])
    }
  }, [open])

  // Search patients/dentists
  const doSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const [patientsRes, dentistsRes] = await Promise.all([
        api.get(`/patients?search=${encodeURIComponent(query)}&limit=5`).catch(() => null),
        api.get(`/dentists?search=${encodeURIComponent(query)}&limit=5`).catch(() => null),
      ])

      const unwrap = (res: any): any[] => {
        const body = res?.data
        if (!body) return []
        const inner = body.data
        if (inner && Array.isArray(inner.data)) return inner.data
        if (Array.isArray(inner)) return inner
        if (Array.isArray(body)) return body
        return []
      }

      const patients: SearchResult[] = unwrap(patientsRes)
        .slice(0, 5)
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          type: "patient" as const,
          subtitle: p.phone || p.cpf,
        }))

      const dentists: SearchResult[] = unwrap(dentistsRes)
        .slice(0, 5)
        .map((d: any) => ({
          id: d.id,
          name: d.name,
          type: "dentist" as const,
          subtitle: d.cro || d.specialty,
        }))

      setResults([...patients, ...dentists])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => doSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search, doSearch])

  function handleSelect(href: string) {
    setOpen(false)
    setSearch("")
    router.push(href)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-150"
        onClick={() => setOpen(false)}
      />

      {/* Command dialog */}
      <Command
        className="relative w-full max-w-[540px] mx-4 rounded-2xl border border-border bg-popover text-popover-foreground shadow-[0_16px_70px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_16px_70px_-12px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
        shouldFilter={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <h2 className="text-sm font-semibold text-foreground">{t("title")}</h2>
          <button
            onClick={() => setOpen(false)}
            className="shrink-0 text-[11px] font-medium text-muted-foreground/70 bg-muted/60 hover:bg-muted px-2 py-1 rounded-md border border-border/50 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border mx-5 mb-0.5 rounded-lg bg-muted/40 px-3">
          {loading ? (
            <Loader2 className="h-[18px] w-[18px] shrink-0 text-primary animate-spin" />
          ) : (
            <Search className="h-[18px] w-[18px] shrink-0 text-muted-foreground/50" />
          )}
          <Command.Input
            ref={inputRef}
            value={search}
            onValueChange={setSearch}
            placeholder={t("placeholder")}
            className="flex h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
          />
        </div>

        <Command.List className="max-h-[360px] overflow-y-auto overscroll-contain scroll-smooth px-3 py-2.5">
          {loading && (
            <Command.Loading>
              <div className="flex items-center gap-2 px-3 py-4 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary/60" />
                {t("searching")}
              </div>
            </Command.Loading>
          )}

          <Command.Empty className="flex flex-col items-center justify-center py-10 text-sm text-muted-foreground/70">
            <Search className="h-10 w-10 mb-3 text-muted-foreground/30" />
            {t("noResults")}
          </Command.Empty>

          {/* Search results */}
          {results.length > 0 && (
            <Command.Group
              heading={
                <span className="flex items-center gap-2 px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                  {t("results")}
                  <span className="text-[10px] font-normal bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                    {results.length}
                  </span>
                </span>
              }
            >
              {results.map((r) => (
                <Command.Item
                  key={`${r.type}-${r.id}`}
                  value={`${r.type}-${r.name}`}
                  onSelect={() =>
                    handleSelect(
                      r.type === "patient"
                        ? `/patients/${r.id}`
                        : `/dentists`
                    )
                  }
                  className="group flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm cursor-pointer transition-colors aria-selected:bg-accent/70 aria-selected:text-accent-foreground"
                >
                  <div className={`flex items-center justify-center h-9 w-9 rounded-lg shrink-0 ${
                    r.type === "patient"
                      ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950"
                      : "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950"
                  }`}>
                    {r.type === "patient" ? (
                      <Users className="h-4 w-4" />
                    ) : (
                      <Stethoscope className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{r.name}</div>
                    {r.subtitle && (
                      <div className="text-xs text-muted-foreground/70 truncate">{r.subtitle}</div>
                    )}
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/30 opacity-0 group-aria-selected:opacity-100 transition-opacity" />
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {/* Separator */}
          {results.length > 0 && !search && (
            <div className="mx-2 my-1.5 border-t border-border/40" />
          )}

          {/* Quick Actions */}
          {!search && (
            <Command.Group
              heading={
                <span className="flex items-center gap-1.5 px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                  {t("quickActions")}
                </span>
              }
            >
              {ACTION_ITEMS.map((item) => (
                <Command.Item
                  key={item.href}
                  value={item.label}
                  onSelect={() => handleSelect(item.href)}
                  className="group flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm cursor-pointer transition-colors aria-selected:bg-accent/70 aria-selected:text-accent-foreground"
                >
                  <div className={`flex items-center justify-center h-9 w-9 rounded-lg shrink-0 ${item.color}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                  <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground/30 opacity-0 group-aria-selected:opacity-100 transition-opacity" />
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {/* Separator */}
          {!search && (
            <div className="mx-2 my-1.5 border-t border-border/40" />
          )}

          {/* Navigation */}
          <Command.Group
            heading={
              <span className="flex items-center gap-1.5 px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                {t("navigation")}
              </span>
            }
          >
            {NAVIGATION_ITEMS.map((item) => (
              <Command.Item
                key={item.href}
                value={item.label}
                onSelect={() => handleSelect(item.href)}
                className="group flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm cursor-pointer transition-colors aria-selected:bg-accent/70 aria-selected:text-accent-foreground"
              >
                <div className={`flex items-center justify-center h-9 w-9 rounded-lg shrink-0 ${item.color}`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="font-medium">{item.label}</span>
                <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground/30 opacity-0 group-aria-selected:opacity-100 transition-opacity" />
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>

        {/* Footer with keyboard hints */}
        <div className="flex items-center gap-4 border-t border-border px-5 py-2.5 text-[11px] text-muted-foreground/50">
          <span className="flex items-center gap-1.5">
            <kbd className="inline-flex items-center justify-center h-[18px] min-w-[18px] px-1 rounded border border-border/60 bg-muted/40 font-mono text-[10px]">
              <CornerDownLeft className="h-2.5 w-2.5" />
            </kbd>
            selecionar
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="inline-flex items-center justify-center h-[18px] min-w-[18px] px-1 rounded border border-border/60 bg-muted/40 font-mono text-[10px]">
              <ArrowUp className="h-2.5 w-2.5" />
            </kbd>
            <kbd className="inline-flex items-center justify-center h-[18px] min-w-[18px] px-1 rounded border border-border/60 bg-muted/40 font-mono text-[10px]">
              <ArrowDown className="h-2.5 w-2.5" />
            </kbd>
            navegar
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="inline-flex items-center justify-center h-[18px] min-w-[18px] px-1 rounded border border-border/60 bg-muted/40 font-mono text-[10px]">
              esc
            </kbd>
            fechar
          </span>
        </div>
      </Command>
    </div>
  )
}
