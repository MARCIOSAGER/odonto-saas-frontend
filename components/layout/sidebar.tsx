"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"
import {
  LayoutDashboard,
  Hospital,
  Users,
  CalendarDays,
  User,
  Wallet,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ChevronDown,
  Smartphone,
  Bot,
  UserCircle,
  ShieldCheck,
  Mail,
  Zap,
  CreditCard,
  BarChart3,
  Star,
  UserCog,
  DollarSign,
  Package,
  Palette,
  Settings2,
} from "lucide-react"
import { useState } from "react"
import { useClinic } from "@/hooks/useClinic"
import { getUploadUrl } from "@/lib/api"

const mainItems = [
  { href: "/home", label: "Dashboard", icon: LayoutDashboard },
  { href: "/conversations", label: "Conversas", icon: MessageSquare },
  { href: "/appointments", label: "Agendamentos", icon: CalendarDays },
  { href: "/patients", label: "Pacientes", icon: Users },
]

const clinicItems = [
  { href: "/dentists", label: "Dentistas", icon: User },
  { href: "/services", label: "Servi\u00e7os", icon: Wallet },
  { href: "/reports", label: "Relat\u00f3rios", icon: BarChart3 },
]

const adminItems = [
  { href: "/clinics", label: "Cl\u00ednicas", icon: Hospital },
  { href: "/admin/users", label: "Usu\u00e1rios", icon: UserCog },
  { href: "/admin/plans", label: "Planos", icon: Package },
  { href: "/admin/billing", label: "Faturamento", icon: DollarSign },
  { href: "/admin/branding", label: "Branding", icon: Palette },
  { href: "/admin/settings", label: "Configura\u00e7\u00f5es", icon: Settings2 },
]

const settingsSubmenu = [
  { href: "/settings/clinic", label: "Minha Cl\u00ednica", icon: Hospital },
  { href: "/settings/whatsapp", label: "WhatsApp", icon: Smartphone },
  { href: "/settings/whatsapp/automations", label: "Automa\u00e7\u00f5es", icon: Zap },
  { href: "/settings/email", label: "E-mail", icon: Mail },
  { href: "/settings/ai", label: "Assistente IA", icon: Bot },
  { href: "/settings/nps", label: "NPS", icon: Star },
  { href: "/settings/billing", label: "Faturamento", icon: CreditCard },
  { href: "/settings/security", label: "Seguran\u00e7a", icon: ShieldCheck },
  { href: "/settings", label: "Minha Conta", icon: UserCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { clinic } = useClinic()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(pathname.includes("/settings"))

  const user = session?.user
  const isAdmin = (user as any)?.role === "superadmin"
  const userInitials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "US"

  const renderNavItem = (item: { href: string; label: string; icon: any }, useStartsWith = false) => {
    const Icon = item.icon
    const active = useStartsWith
      ? pathname === item.href || pathname.startsWith(item.href + "/")
      : pathname === item.href
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
            active
              ? "bg-primary/10 text-primary font-semibold"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-0.5"
          )}
        >
          <Icon size={18} className={cn("shrink-0 transition-colors", active ? "text-primary" : "group-hover:text-primary")} />
          {!isCollapsed && <span>{item.label}</span>}
        </Link>
      </li>
    )
  }

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out z-40",
        isCollapsed ? "w-[70px]" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        <Link href="/home" className="flex items-center gap-3 group overflow-hidden flex-1">
          {(() => {
            const mode = clinic?.logo_display_mode || "logo_name"
            const hasLogo = !!clinic?.logo_url
            const showLogo = hasLogo && (mode === "logo_name" || mode === "logo_only")
            const showName = mode === "logo_name" || mode === "name_only"

            return (
              <>
                {showLogo ? (
                  <img
                    src={getUploadUrl(clinic.logo_url)}
                    alt={clinic.name || "Logo"}
                    className={cn(
                      "object-contain transition-transform group-hover:scale-105",
                      isCollapsed ? "h-8 w-8" : "h-8 max-w-[200px]"
                    )}
                  />
                ) : !showLogo && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-transform group-hover:scale-105">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="currentColor"/>
                    </svg>
                  </div>
                )}
                {!isCollapsed && showName && (
                  <span className="text-lg font-bold tracking-tight text-foreground truncate">
                    {clinic?.name || "Odonto SaaS"}
                  </span>
                )}
              </>
            )
          })()}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors shrink-0"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {/* Main items — no label needed */}
        <ul className="space-y-1">
          {mainItems.map((item) => renderNavItem(item))}
        </ul>

        {/* Divider + Gestão Clínica */}
        <div className="mx-3 my-3 border-t border-border/50" />
        <div>
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70 mb-2">
              Gest&atilde;o Cl&iacute;nica
            </p>
          )}
          <ul className="space-y-1">
            {clinicItems.map((item) => renderNavItem(item))}
          </ul>
        </div>

        {/* Admin (superadmin only) */}
        {isAdmin && (
          <>
            <div className="mx-3 my-3 border-t border-border/50" />
            <div>
              {!isCollapsed && (
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70 mb-2">
                  Administra&ccedil;&atilde;o
                </p>
              )}
              <ul className="space-y-1">
                {adminItems.map((item) => renderNavItem(item, true))}
              </ul>
            </div>
          </>
        )}

        {/* Configurações com Submenu */}
        <div className="mx-3 my-3 border-t border-border/50" />
        <div className="space-y-1">
          <button
            onClick={() => !isCollapsed && setSettingsOpen(!settingsOpen)}
            className={cn(
              "w-full group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              pathname.includes("/settings") && !settingsOpen
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Settings size={18} className={cn("shrink-0", pathname.includes("/settings") ? "text-primary" : "group-hover:text-primary")} />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">Configura&ccedil;&otilde;es</span>
                <ChevronDown size={14} className={cn("transition-transform duration-200", settingsOpen && "rotate-180")} />
              </>
            )}
          </button>

          <div className={cn(
            "overflow-hidden transition-all duration-200 ease-out",
            settingsOpen && !isCollapsed ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}>
            <ul className="mt-1 ml-4 border-l border-border pl-2 space-y-1">
              {settingsSubmenu.map((sub, i) => {
                const SubIcon = sub.icon
                const subActive = pathname === sub.href
                return (
                  <li
                    key={sub.href}
                    className={cn(
                      settingsOpen ? "animate-slide-in-left opacity-0" : ""
                    )}
                    style={settingsOpen ? { animationDelay: `${i * 30}ms` } : undefined}
                  >
                    <Link
                      href={sub.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200",
                        subActive
                          ? "text-primary bg-primary/5"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <SubIcon size={14} />
                      <span>{sub.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </nav>

      {/* User & Footer */}
      <div className="border-t border-border p-4 bg-accent/30">
        {!isCollapsed ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                {userInitials}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate text-foreground">{user?.name || "Usu\u00e1rio"}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email || "dr@clinica.com"}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut size={16} className="mr-2" />
              Sair
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
              {userInitials}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
