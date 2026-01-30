"use client"
import { Search, Bell, Plus, Calendar, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const router = useRouter()

  const handleNewAppointment = () => {
    router.push("/appointments?new=true")
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar pacientes, agendamentos..." 
            className="pl-10 h-10 bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="hidden sm:flex gap-2 font-medium"
          onClick={handleNewAppointment}
        >
          <Plus size={16} />
          Novo Agendamento
        </Button>
        
        <div className="h-8 w-px bg-border mx-2 hidden sm:block" />

        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/appointments")}
          title="Calendário"
        >
          <Calendar size={20} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground" title="Notificações">
              <Bell size={20} />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary border-2 border-background" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhuma notificação no momento
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" title="Ajuda">
              <HelpCircle size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              ⚙️ Configurações
            </DropdownMenuItem>
            <DropdownMenuItem>
              📖 Documentação
            </DropdownMenuItem>
            <DropdownMenuItem>
              💬 Suporte
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
