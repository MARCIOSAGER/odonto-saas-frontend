"use client"
import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Loader2, Search, FileText, Stethoscope, History, Undo2 } from "lucide-react"
import { SurfacePicker } from "./surface-picker"
import {
  useCreateEntry,
  useSupersedeEntry,
  useOdontogramHistory,
} from "@/hooks/useOdontogram"
import type {
  Surface,
  EntryType,
  OdontogramEntry,
  OdontogramLegendItem,
} from "@/hooks/useOdontogram"
import { cn } from "@/lib/utils"

interface ToothDetailPanelProps {
  patientId: string
  toothNumber: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
  legend: OdontogramLegendItem[]
  currentEntries?: OdontogramEntry[]
}

// ─── Finding Form ──────────────────────────────────────────────────

function EntryForm({
  patientId,
  toothNumber,
  entryType,
  legend,
  onSuccess,
}: {
  patientId: string
  toothNumber: number
  entryType: EntryType
  legend: OdontogramLegendItem[]
  onSuccess: () => void
}) {
  const t = useTranslations("odontogram")
  const [statusCode, setStatusCode] = useState("")
  const [surfaces, setSurfaces] = useState<Surface[]>([])
  const [notes, setNotes] = useState("")

  const createEntry = useCreateEntry(patientId)

  const category = entryType === "FINDING" ? "finding" : "procedure"
  const filteredLegend = legend.filter(
    (item) => item.category === category && item.is_active
  )

  const selectedLegendItem = legend.find((item) => item.status_code === statusCode)
  const statusColor = selectedLegendItem?.color

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!statusCode || surfaces.length === 0) return

    await createEntry.mutateAsync({
      tooth_number: toothNumber,
      entry_type: entryType,
      status_code: statusCode,
      surfaces,
      notes: notes.trim() || undefined,
    })

    // Reset form
    setStatusCode("")
    setSurfaces([])
    setNotes("")
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Status code selector */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">{t("statusCode")}</label>
        <Select value={statusCode} onValueChange={setStatusCode}>
          <SelectTrigger className="w-full">
            {statusCode
              ? filteredLegend.find((l) => l.status_code === statusCode)?.label ||
                statusCode
              : t("statusCode")}
          </SelectTrigger>
          <SelectContent>
            {filteredLegend.map((item) => (
              <SelectItem key={item.status_code} value={item.status_code}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm border"
                    style={{
                      backgroundColor: item.color,
                      borderColor: item.border_color,
                    }}
                  />
                  {item.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Surface picker */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">{t("surfaces")}</label>
        <SurfacePicker
          selectedSurfaces={surfaces}
          onSurfacesChange={setSurfaces}
          statusColor={statusColor}
        />
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">{t("notes")}</label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t("notes")}
          rows={3}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full"
        disabled={!statusCode || surfaces.length === 0 || createEntry.isPending}
      >
        {createEntry.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {t("save")}
      </Button>
    </form>
  )
}

// ─── History Tab ────────────────────────────────────────────────────

function HistoryList({
  patientId,
  toothNumber,
  legend,
}: {
  patientId: string
  toothNumber: number
  legend: OdontogramLegendItem[]
}) {
  const t = useTranslations("odontogram")
  const { data, isLoading } = useOdontogramHistory(patientId, {
    tooth_number: toothNumber,
    include_superseded: true,
    limit: 50,
  })
  const supersedeEntry = useSupersedeEntry(patientId)
  const [supersedingId, setSupersedingId] = useState<string | null>(null)
  const [supersedeNotes, setSupersedeNotes] = useState("")

  const entries = data?.entries || []

  const legendMap = useMemo(
    () => new Map(legend.map((l) => [l.status_code, l])),
    [legend]
  )

  function getEntryTypeBadge(type: EntryType) {
    switch (type) {
      case "FINDING":
        return (
          <Badge variant="yellow">
            <Search className="mr-1 h-3 w-3" />
            {t("finding")}
          </Badge>
        )
      case "PROCEDURE":
        return (
          <Badge variant="blue">
            <Stethoscope className="mr-1 h-3 w-3" />
            {t("procedure")}
          </Badge>
        )
      case "NOTE":
        return (
          <Badge variant="gray">
            <FileText className="mr-1 h-3 w-3" />
            {t("note")}
          </Badge>
        )
    }
  }

  function formatSurfaces(surfaces: Surface[]): string {
    return surfaces.join(", ")
  }

  async function handleSupersede(entryId: string) {
    await supersedeEntry.mutateAsync({
      entryId,
      notes: supersedeNotes.trim() || undefined,
    })
    setSupersedingId(null)
    setSupersedeNotes("")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        {t("noEntries")}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const legendItem = legendMap.get(entry.status_code)
        const isSuperseded = !entry.is_active

        return (
          <div
            key={entry.id}
            className={cn(
              "rounded-lg border p-3 space-y-2 transition-colors",
              isSuperseded && "opacity-60 bg-muted/50"
            )}
          >
            {/* Header row */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {getEntryTypeBadge(entry.entry_type)}
                {legendItem && (
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded-sm border"
                      style={{
                        backgroundColor: legendItem.color,
                        borderColor: legendItem.border_color,
                      }}
                    />
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isSuperseded && "line-through"
                      )}
                    >
                      {legendItem.label}
                    </span>
                  </div>
                )}
                {isSuperseded && (
                  <Badge variant="red">{t("corrected")}</Badge>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="text-xs text-muted-foreground space-y-1">
              <div>
                {t("surfaces")}: {formatSurfaces(entry.surfaces)}
              </div>
              {entry.notes && (
                <div>
                  {t("notes")}: {entry.notes}
                </div>
              )}
              {isSuperseded && entry.supersede_notes && (
                <div className="italic">
                  {t("corrected")}: {entry.supersede_notes}
                </div>
              )}
              <div className="flex items-center justify-between pt-1">
                <span>
                  {entry.created_by_name || entry.created_by}
                </span>
                <span>
                  {new Date(entry.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Supersede action */}
            {entry.is_active && (
              <div>
                {supersedingId === entry.id ? (
                  <div className="space-y-2 pt-1">
                    <Textarea
                      value={supersedeNotes}
                      onChange={(e) => setSupersedeNotes(e.target.value)}
                      placeholder={t("notes")}
                      rows={2}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleSupersede(entry.id)}
                        disabled={supersedeEntry.isPending}
                      >
                        {supersedeEntry.isPending && (
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        )}
                        {t("confirm")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSupersedingId(null)
                          setSupersedeNotes("")
                        }}
                      >
                        {t("cancel")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs h-7"
                    onClick={() => setSupersedingId(entry.id)}
                  >
                    <Undo2 className="mr-1 h-3 w-3" />
                    {t("correct")}
                  </Button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Panel ─────────────────────────────────────────────────────

export function ToothDetailPanel({
  patientId,
  toothNumber,
  open,
  onOpenChange,
  legend,
  currentEntries = [],
}: ToothDetailPanelProps) {
  const t = useTranslations("odontogram")

  const activeEntries = currentEntries.filter((e) => e.is_active)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[450px] overflow-y-auto">
        <SheetHeader className="pb-4 pt-6 px-6">
          <SheetTitle>
            {t("toothNumber")} {toothNumber}
          </SheetTitle>
          {activeEntries.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeEntries.map((entry) => {
                const legendItem = legend.find(
                  (l) => l.status_code === entry.status_code
                )
                return (
                  <Badge
                    key={entry.id}
                    variant="outline"
                    className="text-xs"
                    style={{
                      borderColor: legendItem?.border_color,
                      color: legendItem?.color,
                    }}
                  >
                    {legendItem?.label || entry.status_code}
                  </Badge>
                )
              })}
            </div>
          )}
        </SheetHeader>

        <div className="px-6 pb-6">
          {toothNumber && (
            <Tabs defaultValue="finding">
              <TabsList className="w-full">
                <TabsTrigger value="finding" className="flex-1">
                  <Search className="mr-1.5 h-3.5 w-3.5" />
                  {t("finding")}
                </TabsTrigger>
                <TabsTrigger value="procedure" className="flex-1">
                  <Stethoscope className="mr-1.5 h-3.5 w-3.5" />
                  {t("procedure")}
                </TabsTrigger>
                <TabsTrigger value="history" className="flex-1">
                  <History className="mr-1.5 h-3.5 w-3.5" />
                  {t("history")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="finding" className="mt-4">
                <EntryForm
                  patientId={patientId}
                  toothNumber={toothNumber}
                  entryType="FINDING"
                  legend={legend}
                  onSuccess={() => {}}
                />
              </TabsContent>

              <TabsContent value="procedure" className="mt-4">
                <EntryForm
                  patientId={patientId}
                  toothNumber={toothNumber}
                  entryType="PROCEDURE"
                  legend={legend}
                  onSuccess={() => {}}
                />
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <HistoryList
                  patientId={patientId}
                  toothNumber={toothNumber}
                  legend={legend}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
