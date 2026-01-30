"use client"
import { useState, useRef, useEffect } from "react"
import { useConversations, useMessages, useSendMessage } from "@/hooks/useConversations"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Send, MessageSquare, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export default function ConversationsPage() {
  const [search, setSearch] = useState("")
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { conversations, isLoading: loadingConversations } = useConversations(search)
  const { messages, patient, isLoading: loadingChat } = useMessages(selectedPhone)
  const sendMessage = useSendMessage()

  const selectedConversation = Array.isArray(conversations)
    ? conversations.find((c: any) => c.phone === selectedPhone)
    : null

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Mark as read when selecting a conversation
  useEffect(() => {
    if (selectedPhone) {
      import("@/lib/api").then(({ api }) => {
        api.post(`/conversations/${selectedPhone}/read`).catch(() => {})
      })
    }
  }, [selectedPhone])

  const handleSend = () => {
    if (!messageText.trim() || !selectedPhone) return
    sendMessage.mutate(
      { phone: selectedPhone, message: messageText.trim() },
      { onSuccess: () => setMessageText("") }
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "HH:mm")
    } catch {
      return ""
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy HH:mm")
    } catch {
      return ""
    }
  }

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6 overflow-hidden">
      {/* Lista de Conversas */}
      <div className="w-80 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Buscar paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-card border-border shadow-sm text-gray-900 dark:text-gray-100"
          />
        </div>

        <Card className="flex-1 border-border bg-card shadow-sm overflow-hidden">
          <CardContent className="p-0 h-full overflow-y-auto">
            {loadingConversations ? (
              <div className="flex p-8 justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
              <div className="divide-y divide-border">
                {!Array.isArray(conversations) || conversations.length === 0 ? (
                  <p className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">Nenhuma conversa encontrada.</p>
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
                        {(c.patient_name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {c.patient_name || c.phone}
                          </span>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                            {c.last_message_at ? formatTime(c.last_message_at) : ""}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{c.last_message}</p>
                      </div>
                      {c.unread_count > 0 && (
                        <div className="h-5 min-w-[20px] px-1 rounded-full bg-primary text-[10px] text-white flex items-center justify-center font-bold">
                          {c.unread_count}
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
                  {(selectedConversation?.patient_name || patient?.name || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">
                    {selectedConversation?.patient_name || patient?.name || selectedPhone}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedPhone}
                    {patient?._count?.appointments ? ` \u00b7 ${patient._count.appointments} consulta(s)` : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#F8FAFC] dark:bg-gray-900/50">
              {loadingChat ? (
                <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : !Array.isArray(messages) || messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400 text-sm">Nenhuma mensagem nesta conversa.</div>
              ) : (
                messages.map((m: any) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex flex-col max-w-[70%]",
                      m.direction === "outgoing" ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div className={cn(
                      "p-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap break-words",
                      m.direction === "outgoing"
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-border rounded-tl-none"
                    )}>
                      {m.message}
                    </div>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 px-1">
                      {m.created_at ? formatTime(m.created_at) : ""}
                    </span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de Mensagem */}
            <div className="p-4 border-t border-border bg-white dark:bg-gray-800">
              <div className="flex gap-3">
                <Input
                  placeholder="Escreva sua mensagem..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
                  disabled={sendMessage.isPending}
                />
                <Button
                  size="icon"
                  className="h-11 w-11 shrink-0"
                  onClick={handleSend}
                  disabled={sendMessage.isPending || !messageText.trim()}
                >
                  {sendMessage.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-center text-gray-500 dark:text-gray-400 mt-2">
                Enviar uma mensagem manual pausa temporariamente a IA para este paciente.
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-gray-500 dark:text-gray-400">
              <MessageSquare size={40} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Suas Conversas</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                Selecione uma conversa ao lado para visualizar o histórico e interagir com o paciente.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
