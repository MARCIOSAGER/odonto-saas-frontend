"use client"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Loader2, Plus, Trash2, CheckCircle2 } from "lucide-react"
import { useHofPlan, PROCEDURE_TYPE_LABELS, FACIAL_REGION_LABELS, type HofProcedureType, type FacialRegion, type HofPlanItem } from "@/hooks/useHof"
import { formatCurrency } from "@/lib/format-utils"

interface HofPlanTabProps {
  patientId: string
}

export function HofPlanTab({ patientId }: HofPlanTabProps) {
  const t = useTranslations("hof")
  const tc = useTranslations("common")

  const { items, isLoading, create, update, remove, isCreating } = useHofPlan(patientId)
  const [dialogOpen, setDialogOpen] = useState(false)

  const [form, setForm] = useState({
    procedure_type: "" as HofProcedureType | "",
    facial_region: "" as FacialRegion | "",
    product_name: "",
    quantity: "",
    estimated_price: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.procedure_type || !form.facial_region) return

    try {
      await create({
        procedure_type: form.procedure_type as HofProcedureType,
        facial_region: form.facial_region as FacialRegion,
        product_name: form.product_name || undefined,
        quantity: form.quantity || undefined,
        estimated_price: form.estimated_price ? parseFloat(form.estimated_price) : undefined,
        notes: form.notes || undefined,
      })
      setDialogOpen(false)
      setForm({
        procedure_type: "",
        facial_region: "",
        product_name: "",
        quantity: "",
        estimated_price: "",
        notes: "",
      })
    } catch {
      // Error handled by hook
    }
  }

  const handleToggleComplete = async (item: HofPlanItem) => {
    try {
      await update({
        id: item.id,
        is_completed: !item.is_completed,
        completed_at: !item.is_completed ? new Date().toISOString() : null,
      })
    } catch {
      // Error handled by hook
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await remove(id)
    } catch {
      // Error handled by hook
    }
  }

  const total = items.reduce((sum, item) => sum + (item.estimated_price || 0), 0)
  const completedCount = items.filter((item) => item.is_completed).length

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
          <CardTitle className="text-lg">{t("plan.title")}</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                {t("plan.addItem")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("plan.addItem")}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t("plan.procedure")}</Label>
                    <Select
                      value={form.procedure_type}
                      onValueChange={(v) => setForm({ ...form, procedure_type: v as HofProcedureType })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
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
                    <Label>{t("plan.region")}</Label>
                    <Select
                      value={form.facial_region}
                      onValueChange={(v) => setForm({ ...form, facial_region: v as FacialRegion })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(FACIAL_REGION_LABELS).map(([key, label]) => (
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
                      value={form.product_name}
                      onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                      placeholder="Ex: Botox, Juvederm..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t("plan.quantity")}</Label>
                    <Input
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      placeholder="Ex: 50UI, 1ml..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t("plan.price")}</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={form.estimated_price}
                      onChange={(e) => setForm({ ...form, estimated_price: e.target.value })}
                      placeholder="0,00"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label>{tc("notes")}</Label>
                    <Input
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Observações..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    {tc("cancel")}
                  </Button>
                  <Button type="submit" disabled={isCreating || !form.procedure_type || !form.facial_region}>
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
        {items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>{t("plan.noItems")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {completedCount}/{items.length} itens concluídos
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{t("plan.total")}</p>
                <p className="text-lg font-semibold">{formatCurrency(total)}</p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-4 p-4 border rounded-lg transition-colors ${
                    item.is_completed ? "bg-green-50/50 border-green-200" : ""
                  }`}
                >
                  <Checkbox
                    checked={item.is_completed}
                    onCheckedChange={() => handleToggleComplete(item)}
                    className="mt-1"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={item.is_completed ? "green" : "secondary"}>
                        {PROCEDURE_TYPE_LABELS[item.procedure_type]}
                      </Badge>
                      <Badge variant="outline">
                        {FACIAL_REGION_LABELS[item.facial_region]}
                      </Badge>
                      {item.is_completed && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </div>

                    {(item.product_name || item.quantity) && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.product_name}
                        {item.quantity && ` - ${item.quantity}`}
                      </p>
                    )}

                    {item.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    {item.estimated_price && (
                      <p className="font-medium">{formatCurrency(item.estimated_price)}</p>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
