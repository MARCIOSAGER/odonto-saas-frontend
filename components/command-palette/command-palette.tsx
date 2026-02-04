"use client"
import { useEffect, useState, useCallback } from "react"
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
  ClipboardList,
  CreditCard,
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

  const NAVIGATION_ITEMS = [
    { label: tNav("dashboard"), href: "/home", icon: Home },
    { label: tNav("appointments"), href: "/appointments", icon: CalendarDays },
    { label: tNav("patients"), href: "/patients", icon: Users },
    { label: tNav("dentists"), href: "/dentists", icon: Stethoscope },
    { label: tNav("services"), href: "/services", icon: FileText },
    { label: tNav("conversations"), href: "/conversations", icon: MessageSquare },
    { label: tNav("settings"), href: "/settings", icon: Settings },
    { label: tNav("billing"), href: "/settings/billing", icon: CreditCard },
  ]

  const ACTION_ITEMS = [
    { label: t("newPatient"), href: "/patients?new=true", icon: UserPlus },
    { label: t("newAppointment"), href: "/appointments?new=true", icon: CalendarDays },
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

      // TransformInterceptor wraps: { success, data: { data: [...], meta } } or { success, data: [...] }
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
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Command dialog */}
      <div className="absolute left-1/2 top-[20%] -translate-x-1/2 w-full max-w-lg">
        <Command
          className="rounded-xl border shadow-2xl bg-popover text-popover-foreground overflow-hidden"
          shouldFilter={false}
        >
          <div className="flex items-center border-b px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground mr-2" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder={t("placeholder")}
              className="flex h-12 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="ml-2 shrink-0 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2">
            {loading && (
              <Command.Loading>
                <div className="px-3 py-2 text-sm text-muted-foreground">{t("searching")}</div>
              </Command.Loading>
            )}

            <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">
              {t("noResults")}
            </Command.Empty>

            {/* Search results */}
            {results.length > 0 && (
              <Command.Group heading={t("results")}>
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
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-accent"
                  >
                    {r.type === "patient" ? (
                      <Users className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <div className="font-medium">{r.name}</div>
                      {r.subtitle && (
                        <div className="text-xs text-muted-foreground">{r.subtitle}</div>
                      )}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Actions */}
            {!search && (
              <Command.Group heading={t("quickActions")}>
                {ACTION_ITEMS.map((item) => (
                  <Command.Item
                    key={item.href}
                    value={item.label}
                    onSelect={() => handleSelect(item.href)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-accent"
                  >
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    {item.label}
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Navigation */}
            <Command.Group heading={t("navigation")}>
              {NAVIGATION_ITEMS.map((item) => (
                <Command.Item
                  key={item.href}
                  value={item.label}
                  onSelect={() => handleSelect(item.href)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-accent"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  )
}
