"use client"
import { useState, useRef, useEffect, useMemo } from "react"
import { useConversations, useMessages, useSendMessage } from "@/hooks/useConversations"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { Search, Send, MessageSquare, Loader2, Plus, User, Phone, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useTranslations } from "next-intl"

export default function ConversationsPage() {
  const isMobile = useIsMobile()
  const t = useTranslations("conversations")
  const tc = useTranslations("common")
  const [search, setSearch] = useState("")
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Nova conversa
  const [showNewChat, setShowNewChat] = useState(false)
  const [newChatSearch, setNewChatSearch] = useState("")
  const [newChatPhone, setNewChatPhone] = useState("")
  const [patients, setPatients] = useState<any[]>([])
  const [loadingPatients, setLoadingPatients] = useState(false)

  const { conversations, isLoading: loadingConversations, refetch: refetchConversations } = useConversations(search)
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
      api.post(`/conversations/${selectedPhone}/read`).catch(() => {})
    }
  }, [selectedPhone])

  // Buscar pacientes para nova conversa
  useEffect(() => {
    if (!showNewChat) return
    setLoadingPatients(true)
    api.get("/patients", { params: { q: newChatSearch, limit: 50 } })
      .then((res) => {
        const data = res.data?.data
        const arr = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : [])
        setPatients(arr)
      })
      .catch(() => setPatients([]))
      .finally(() => setLoadingPatients(false))
  }, [showNewChat, newChatSearch])

  // Filtrar pacientes que tem telefone
  const patientsWithPhone = useMemo(() =>
    patients.filter((p: any) => p.phone),
    [patients]
  )

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

  const handleStartChat = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "")
    if (!cleaned) {
      toast.error(t("invalidPhone"))
      return
    }
    setSelectedPhone(cleaned)
    setShowNewChat(false)
    setNewChatSearch("")
    setNewChatPhone("")
  }

  const formatTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "HH:mm")
    } catch {
      return ""
    }
  }

  return (
    <div className={cn("flex h-[calc(100vh-120px)] overflow-hidden", isMobile ? "flex-col" : "gap-6")}>
      {/* Lista de Conversas */}
      <div className={cn("flex flex-col gap-4", isMobile ? (selectedPhone ? "hidden" : "w-full") : "w-80")}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder={t("searchPatient")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-card border-border shadow-sm text-gray-900 dark:text-gray-100"
            />
          </div>
          <Button
            size="icon"
            className="h-11 w-11 shrink-0"
            onClick={() => setShowNewChat(true)}
            title={t("newConversation")}
          >
            <Plus size={18} />
          </Button>
        </div>

        <Card className="flex-1 border-border bg-card shadow-sm overflow-hidden">
          <CardContent className="p-0 h-full overflow-y-auto">
            {loadingConversations ? (
              <div className="flex p-8 justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
              <div className="divide-y divide-border">
                {!Array.isArray(conversations) || conversations.length === 0 ? (
                  <div className="p-8 text-center space-y-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("noConversations")}</p>
                    <Button variant="outline" size="sm" onClick={() => setShowNewChat(true)} className="gap-2">
                      <Plus size={14} />
                      {t("startConversation")}
                    </Button>
                  </div>
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
      <Card className={cn("border-border bg-card shadow-sm flex flex-col overflow-hidden", isMobile ? (selectedPhone ? "flex-1" : "hidden") : "flex-1")}>
        {selectedPhone ? (
          <>
            {/* Header do Chat */}
            <div className="p-4 border-b border-border bg-muted/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => setSelectedPhone(null)}
                    aria-label={tc("back")}
                  >
                    <ArrowLeft size={18} />
                  </Button>
                )}
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {(selectedConversation?.patient_name || patient?.name || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">
                    {selectedConversation?.patient_name || patient?.name || selectedPhone}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedPhone}
                    {patient?._count?.appointments ? ` \u00b7 ${t("appointmentCount", { count: patient._count.appointments })}` : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Mensagens */}
            <div className={cn("flex-1 overflow-y-auto space-y-3 bg-[#F8FAFC] dark:bg-gray-900/50", isMobile ? "p-3" : "p-6")}>
              {loadingChat ? (
                <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : !Array.isArray(messages) || messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                  {t("noMessages")}
                </div>
              ) : (
                messages.map((m: any) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex flex-col",
                      isMobile ? "max-w-[85%]" : "max-w-[70%]",
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
                  placeholder={t("messagePlaceholder")}
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
                {t("manualMessageNote")}
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-gray-500 dark:text-gray-400">
              <MessageSquare size={40} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t("yourConversations")}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                {t("selectConversationHint")}
              </p>
            </div>
            <Button onClick={() => setShowNewChat(true)} className="gap-2">
              <Plus size={16} />
              {t("newConversation")}
            </Button>
          </div>
        )}
      </Card>

      {/* Dialog Nova Conversa */}
      <Dialog open={showNewChat} onOpenChange={setShowNewChat}>
        <DialogContent className="dark:bg-gray-900">
          <DialogHeader title={t("dialogTitle")} description={t("dialogDescription")} />
          <div className="p-4 space-y-4">
            {/* Opção 1: Digitar número */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Phone size={14} />
                {t("sendToNumber")}
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder={t("phoneExample")}
                  value={newChatPhone}
                  onChange={(e) => setNewChatPhone(e.target.value)}
                  className="flex-1 bg-muted/30 border-none h-10 text-gray-900 dark:text-gray-100"
                />
                <Button
                  size="sm"
                  className="h-10 px-4"
                  disabled={!newChatPhone.replace(/\D/g, "")}
                  onClick={() => handleStartChat(newChatPhone)}
                >
                  {t("start")}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("phoneFormatHint")}
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground">{t("orSelectPatient")}</span>
              </div>
            </div>

            {/* Opção 2: Selecionar paciente */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder={t("searchPatientByName")}
                  value={newChatSearch}
                  onChange={(e) => setNewChatSearch(e.target.value)}
                  className="pl-10 bg-muted/30 border-none h-10 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="max-h-48 overflow-y-auto rounded-md border border-border">
                {loadingPatients ? (
                  <div className="flex p-4 justify-center"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
                ) : patientsWithPhone.length === 0 ? (
                  <p className="p-4 text-center text-sm text-muted-foreground">
                    {patients.length > 0 ? t("noPatientWithPhone") : t("noPatientFound")}
                  </p>
                ) : (
                  patientsWithPhone.map((p: any) => (
                    <button
                      key={p.id}
                      onClick={() => handleStartChat(p.phone)}
                      className="w-full p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left border-b border-border last:border-b-0"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {(p.name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate block">{p.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{p.phone}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
