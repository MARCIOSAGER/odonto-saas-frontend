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
  UserCircle
} from "lucide-react"
import { useState } from "react"

const mainItems = [
  { href: "/home", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/conversations", label: "Conversas", icon: MessageSquare },
  { href: "/dashboard/appointments", label: "Agendamentos", icon: CalendarDays },
  { href: "/dashboard/patients", label: "Pacientes", icon: Users },
]

const clinicItems = [
  { href: "/dashboard/clinics", label: "Minha Clínica", icon: Hospital },
  { href: "/dashboard/dentists", label: "Dentistas", icon: User },
  { href: "/dashboard/services", label: "Serviços", icon: Wallet },
]

const settingsSubmenu = [
  { href: "/dashboard/settings/whatsapp", label: "WhatsApp", icon: Smartphone },
  { href: "/dashboard/settings/ai", label: "Assistente IA", icon: Bot },
  { href: "/dashboard/settings", label: "Minha Conta", icon: UserCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(pathname.includes("/settings"))
  
  const user = session?.user
  const userInitials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "US"

  return (
    <aside 
      className={cn(
        "relative flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out z-40",
        isCollapsed ? "w-[70px]" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center px-4 border-b border-border">
        <Link href="/home" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-transform group-hover:scale-105">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold tracking-tight text-foreground">
              Odonto SaaS
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
        {/* Menu Principal */}
        <div>
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Menu Principal
            </p>
          )}
          <ul className="space-y-1">
            {mainItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      active 
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon size={18} className={cn("shrink-0", active ? "text-white" : "group-hover:text-primary")} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Gestão Clínica */}
        <div>
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Gestão Clínica
            </p>
          )}
          <ul className="space-y-1">
            {clinicItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      active 
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon size={18} className={cn("shrink-0", active ? "text-white" : "group-hover:text-primary")} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Configurações com Submenu */}
        <div>
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Sistema
            </p>
          )}
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
                  <span className="flex-1 text-left">Configurações</span>
                  <ChevronDown size={14} className={cn("transition-transform duration-200", settingsOpen && "rotate-180")} />
                </>
              )}
            </button>
            
            {settingsOpen && !isCollapsed && (
              <ul className="mt-1 ml-4 border-l border-border pl-2 space-y-1">
                {settingsSubmenu.map((sub) => {
                  const SubIcon = sub.icon
                  const subActive = pathname === sub.href
                  return (
                    <li key={sub.href}>
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
            )}
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
                <p className="text-sm font-semibold truncate text-foreground">{user?.name || "Usuário"}</p>
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

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:text-primary transition-colors z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  )
}
