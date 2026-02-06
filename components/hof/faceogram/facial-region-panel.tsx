"use client"
import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, History, CheckCircle2, XCircle, Edit3 } from "lucide-react"
import { formatDate } from "@/lib/format-utils"
import { PROCEDURE_TYPE_LABELS, type HofProcedureType, type FacialRegion, type FaceogramEntry } from "@/hooks/useHof"

interface FacialRegionPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  region: FacialRegion | null
  entries: FaceogramEntry[]
  onAddEntry?: (data: {
    procedure_type: HofProcedureType
    product_name?: string
    quantity?: string
    notes?: string
  }) => void
  onCorrectEntry?: (entryId: string, reason: string) => void
  readOnly?: boolean
  colorMap?: Map<string, string>
}

export function FacialRegionPanel({
  open,
  onOpenChange,
  region,
  entries,
  onAddEntry,
  onCorrectEntry,
  readOnly = false,
  colorMap,
}: FacialRegionPanelProps) {
  const t = useTranslations("hof")
  const tc = useTranslations("common")

  const [activeTab, setActiveTab] = useState<"add" | "history">("add")
  const [procedureType, setProcedureType] = useState<HofProcedureType>("TOXINA_BOTULINICA")
  const [productName, setProductName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [notes, setNotes] = useState("")
  const [correctingEntryId, setCorrectingEntryId] = useState<string | null>(null)
  const [correctionReason, setCorrectionReason] = useState("")

  const activeEntries = entries.filter((e) => e.is_active)
  const inactiveEntries = entries.filter((e) => !e.is_active)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!onAddEntry) return

    onAddEntry({
      procedure_type: procedureType,
      product_name: productName || undefined,
      quantity: quantity || undefined,
      notes: notes || undefined,
    })

    // Reset form
    setProcedureType("TOXINA_BOTULINICA")
    setProductName("")
    setQuantity("")
    setNotes("")
  }

  function handleCorrect() {
    if (!correctingEntryId || !onCorrectEntry) return
    onCorrectEntry(correctingEntryId, correctionReason)
    setCorrectingEntryId(null)
    setCorrectionReason("")
  }

  if (!region) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor: colorMap?.get(activeEntries[0]?.procedure_type) || "#D1D5DB",
              }}
            />
            {t(`facialRegions.${region}`)}
          </SheetTitle>
          <SheetDescription>
            {activeEntries.length > 0
              ? `${activeEntries.length} ${t("faceogram.history").toLowerCase()}`
              : t("faceogram.noEntries")}
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "add" | "history")} className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add" className="gap-2" disabled={readOnly}>
              <Plus size={14} />
              {t("faceogram.addEntry")}
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History size={14} />
              {t("faceogram.history")}
            </TabsTrigger>
          </TabsList>

          {/* Add Entry Tab */}
          <TabsContent value="add" className="mt-4">
            {readOnly ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {tc("viewDetails")}
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("plan.procedure")}</Label>
                  <Select
                    value={procedureType}
                    onValueChange={(v) => setProcedureType(v as HofProcedureType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PROCEDURE_TYPE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("plan.product")}</Label>
                  <Input
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Ex: Botox, Juvederm..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("plan.quantity")}</Label>
                  <Input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Ex: 50UI, 1ml..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>{tc("notes")}</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("sessions.notes")}
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Plus size={16} className="mr-2" />
                  {t("faceogram.addEntry")}
                </Button>
              </form>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-4 space-y-4">
            {/* Active entries */}
            {activeEntries.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Registros ativos
                </h4>
                {activeEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 border rounded-lg bg-card space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Badge
                        style={{
                          backgroundColor: colorMap?.get(entry.procedure_type) || "#6B7280",
                          color: "white",
                        }}
                      >
                        {PROCEDURE_TYPE_LABELS[entry.procedure_type as HofProcedureType] ||
                          entry.procedure_type}
                      </Badge>
                      {!readOnly && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => setCorrectingEntryId(entry.id)}
                        >
                          <Edit3 size={12} className="mr-1" />
                          Corrigir
                        </Button>
                      )}
                    </div>

                    {entry.product_name && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Produto:</span>{" "}
                        {entry.product_name}
                        {entry.quantity && ` (${entry.quantity})`}
                      </p>
                    )}

                    {entry.notes && (
                      <p className="text-sm text-muted-foreground">{entry.notes}</p>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {formatDate(entry.created_at)}
                      {entry.created_by_name && ` • ${entry.created_by_name}`}
                    </p>

                    {/* Correction form */}
                    {correctingEntryId === entry.id && (
                      <div className="mt-3 p-3 bg-destructive/10 rounded-lg space-y-2">
                        <p className="text-xs font-medium text-destructive">
                          Motivo da correção:
                        </p>
                        <Textarea
                          value={correctionReason}
                          onChange={(e) => setCorrectionReason(e.target.value)}
                          placeholder="Descreva o motivo da correção..."
                          rows={2}
                          className="text-sm"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={handleCorrect}
                            disabled={!correctionReason.trim()}
                          >
                            Confirmar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setCorrectingEntryId(null)
                              setCorrectionReason("")
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t("faceogram.noEntries")}
              </p>
            )}

            {/* Inactive/corrected entries */}
            {inactiveEntries.length > 0 && (
              <div className="space-y-3 pt-4 border-t">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <XCircle size={14} />
                  Registros corrigidos
                </h4>
                {inactiveEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 border rounded-lg bg-muted/50 opacity-60 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {PROCEDURE_TYPE_LABELS[entry.procedure_type as HofProcedureType] ||
                          entry.procedure_type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {t("faceogram.corrected")}
                      </Badge>
                    </div>

                    {entry.product_name && (
                      <p className="text-sm line-through">
                        {entry.product_name}
                        {entry.quantity && ` (${entry.quantity})`}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {formatDate(entry.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
