"use client"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Plus, Calendar, User, ChevronDown, FileSignature } from "lucide-react"
import { useHofSessions, useHofConsent, type HofSession } from "@/hooks/useHof"
import { useDentists } from "@/hooks/useDentists"
import { formatDate } from "@/lib/format-utils"

interface HofSessionsTabProps {
  patientId: string
}

export function HofSessionsTab({ patientId }: HofSessionsTabProps) {
  const t = useTranslations("hof")
  const tc = useTranslations("common")

  const { sessions, isLoading, create, isCreating } = useHofSessions(patientId)
  const { dentists } = useDentists()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [expandedSession, setExpandedSession] = useState<string | null>(null)

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    dentist_id: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await create({
        date: form.date,
        dentist_id: form.dentist_id || undefined,
        notes: form.notes || undefined,
        status: "scheduled",
      })
      setDialogOpen(false)
      setForm({
        date: new Date().toISOString().split("T")[0],
        dentist_id: "",
        notes: "",
      })
    } catch {
      // Error handled by hook
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t("sessions.title")}</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                {t("sessions.newSession")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("sessions.newSession")}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("sessions.date")}</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("sessions.professional")}</Label>
                  <Select
                    value={form.dentist_id}
                    onValueChange={(v) => setForm({ ...form, dentist_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {dentists.map((d: { id: string; name: string }) => (
                        <SelectItem key={d.id} value={d.id}>
                          Dr(a). {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("sessions.notes")}</Label>
                  <Textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Observações da sessão..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    {tc("cancel")}
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      tc("save")
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>{t("sessions.noSessions")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                expanded={expandedSession === session.id}
                onToggle={() =>
                  setExpandedSession(
                    expandedSession === session.id ? null : session.id
                  )
                }
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface SessionItemProps {
  session: HofSession
  expanded: boolean
  onToggle: () => void
}

function SessionItem({ session, expanded, onToggle }: SessionItemProps) {
  const t = useTranslations("hof")

  const statusVariant =
    session.status === "completed"
      ? "green"
      : session.status === "scheduled"
      ? "secondary"
      : "outline"

  const statusLabel =
    session.status === "completed"
      ? "Concluída"
      : session.status === "scheduled"
      ? "Agendada"
      : session.status

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="font-medium text-foreground">
              {formatDate(session.date)}
            </span>
          </div>

          {session.dentist_name && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Dr(a). {session.dentist_name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={statusVariant}>{statusLabel}</Badge>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {expanded && (
        <div className="p-4 pt-0 border-t space-y-4">
          {session.notes && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {t("sessions.notes")}:
              </p>
              <p className="text-sm">{session.notes}</p>
            </div>
          )}

          <SessionConsent sessionId={session.id} />
        </div>
      )}
    </div>
  )
}

function SessionConsent({ sessionId }: { sessionId: string }) {
  const t = useTranslations("hof")
  const { consent, isLoading, create, isCreating } = useHofConsent(sessionId)

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Carregando termo...
      </div>
    )
  }

  if (!consent) {
    return (
      <Button variant="outline" size="sm" onClick={() => create()} disabled={isCreating}>
        {isCreating ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <FileSignature className="h-4 w-4 mr-2" />
        )}
        Gerar Termo de Consentimento
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <FileSignature className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{t("consent.title")}</span>
      </div>

      {consent.signed_at ? (
        <Badge variant="green">{t("consent.signed")}</Badge>
      ) : (
        <Badge variant="outline">{t("consent.pending")}</Badge>
      )}

      {consent.pdf_url && (
        <Button variant="ghost" size="sm" asChild>
          <a href={consent.pdf_url} target="_blank" rel="noopener noreferrer">
            Ver PDF
          </a>
        </Button>
      )}
    </div>
  )
}
