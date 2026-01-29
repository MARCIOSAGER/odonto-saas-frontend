"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Send, User, MessageSquare, Loader2, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function ConversationsPage() {
  const [search, setSearch] = useState("")
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null)

  // Buscar lista de conversas (agrupadas por telefone)
  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations", search],
    queryFn: async () => {
      const res = await api.get("/conversations", { params: { q: search } })
      return res.data?.data || []
    }
  })

  // Buscar histórico de mensagens do telefone selecionado
  const { data: messages, isLoading: loadingChat } = useQuery({
    queryKey: ["messages", selectedPhone],
    queryFn: async () => {
      if (!selectedPhone) return []
      const res = await api.get(`/conversations/${selectedPhone}`)
      return res.data?.data || []
    },
    enabled: !!selectedPhone
  })

  const selectedConversation = conversations?.find((c: any) => c.phone === selectedPhone)

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6 overflow-hidden">
      {/* Lista de Conversas */}
      <div className="w-80 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar paciente..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-card border-border shadow-sm"
          />
        </div>

        <Card className="flex-1 border-border bg-card shadow-sm overflow-hidden">
          <CardContent className="p-0 h-full overflow-y-auto">
            {isLoading ? (
              <div className="flex p-8 justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
              <div className="divide-y divide-border">
                {!Array.isArray(conversations) || conversations.length === 0 ? (
                  <p className="p-8 text-center text-sm text-muted-foreground">Nenhuma conversa encontrada.</p>
                ) : (
                  conversations.map((c: any) => (
                    <button
                      key={c.phone}
                      onClick={() => setSelectedPhone(c.phone)}
                      className={cn(
                        "w-full p-4 flex gap-3 hover:bg-muted/50 transition-colors text-left",
                        selectedPhone === c.phone && "bg-primary/5 border-l-4 border-primary"
                      )}
                    >
                      <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center font-bold text-xs shrink-0">
                        {c.name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <span className="font-semibold text-foreground truncate">{c.name || "Paciente"}</span>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                            {c.time ? format(new Date(c.time), 'HH:mm') : ""}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                      </div>
                      {c.unread > 0 && (
                        <div className="h-4 w-4 rounded-full bg-primary text-[10px] text-white flex items-center justify-center font-bold">
                          {c.unread}
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Janela de Chat */}
      <Card className="flex-1 border-border bg-card shadow-sm flex flex-col overflow-hidden">
        {selectedPhone ? (
          <>
            {/* Header do Chat */}
            <div className="p-4 border-b border-border bg-muted/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {selectedConversation?.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{selectedConversation?.name}</h3>
                  <p className="text-xs text-success flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                    Atendimento via IA
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2 h-9">
                  <Calendar size={14} />
                  Ver Prontuário
                </Button>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8FAFC]">
              {loadingChat ? (
                <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : !Array.isArray(messages) || messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Nenhuma mensagem nesta conversa.</div>
              ) : (
                messages.map((m: any) => (
                  <div 
                    key={m.id} 
                    className={cn(
                      "flex flex-col max-w-[70%]",
                      m.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div className={cn(
                      "p-3 rounded-2xl text-sm shadow-sm",
                      m.sender === "user" 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-white text-foreground border border-border rounded-tl-none"
                    )}>
                      {m.text}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 px-1">{m.time}</span>
                  </div>
                ))
              )}
            </div>

            {/* Input de Mensagem */}
            <div className="p-4 border-t border-border bg-white">
              <div className="flex gap-3">
                <Input 
                  placeholder="Escreva sua mensagem..." 
                  className="bg-muted/30 border-none h-11"
                />
                <Button size="icon" className="h-11 w-11 shrink-0">
                  <Send size={18} />
                </Button>
              </div>
              <p className="text-[10px] text-center text-muted-foreground mt-2">
                Intervir no chat pausará temporariamente a automação da IA para este paciente.
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <MessageSquare size={40} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">Suas Conversas</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Selecione uma conversa ao lado para visualizar o histórico e interagir com o paciente.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
