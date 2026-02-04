"use client"
import { useEffect, useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import { api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Package,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface Plan {
  id: string
  name: string
  display_name: string
  description: string | null
  price_monthly: number
  price_yearly: number | null
  max_patients: number | null
  max_dentists: number | null
  max_appointments_month: number | null
  ai_enabled: boolean
  priority_support: boolean
  custom_branding: boolean
  is_active: boolean
  sort_order: number
  created_at: string
}

const emptyForm = {
  name: "",
  display_name: "",
  description: "",
  price_monthly: 0,
  price_yearly: 0,
  max_patients: "",
  max_dentists: "",
  max_appointments_month: "",
  ai_enabled: false,
  priority_support: false,
  custom_branding: false,
  sort_order: 0,
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Plan | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Plan | null>(null)
  const [deleting, setDeleting] = useState(false)

  const t = useTranslations("adminPlans")

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get("/plans?include_inactive=true")
      const body = res.data?.data || res.data
      setPlans(Array.isArray(body) ? body : body?.data || [])
    } catch {
      toast.error(t("loadError"))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    loadData()
  }, [loadData])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(plan: Plan) {
    setEditing(plan)
    setForm({
      name: plan.name,
      display_name: plan.display_name,
      description: plan.description || "",
      price_monthly: Number(plan.price_monthly),
      price_yearly: Number(plan.price_yearly) || 0,
      max_patients: plan.max_patients != null ? String(plan.max_patients) : "",
      max_dentists: plan.max_dentists != null ? String(plan.max_dentists) : "",
      max_appointments_month: plan.max_appointments_month != null ? String(plan.max_appointments_month) : "",
      ai_enabled: plan.ai_enabled,
      priority_support: plan.priority_support,
      custom_branding: plan.custom_branding,
      sort_order: plan.sort_order,
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.name || !form.display_name) {
      toast.error(t("nameRequired"))
      return
    }
    setSaving(true)
    try {
      const payload: any = {
        name: form.name,
        display_name: form.display_name,
        description: form.description || undefined,
        price_monthly: Number(form.price_monthly),
        price_yearly: Number(form.price_yearly) || undefined,
        max_patients: form.max_patients ? parseInt(form.max_patients as string) : undefined,
        max_dentists: form.max_dentists ? parseInt(form.max_dentists as string) : undefined,
        max_appointments_month: form.max_appointments_month ? parseInt(form.max_appointments_month as string) : undefined,
        ai_enabled: form.ai_enabled,
        priority_support: form.priority_support,
        custom_branding: form.custom_branding,
        sort_order: form.sort_order,
      }

      if (editing) {
        await api.patch(`/plans/${editing.id}`, payload)
        toast.success(t("planUpdated"))
      } else {
        await api.post("/plans", payload)
        toast.success(t("planCreated"))
      }
      setDialogOpen(false)
      loadData()
    } catch (err: any) {
      const msg = err?.response?.data?.message
      toast.error(typeof msg === "string" ? msg : t("saveError"))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.delete(`/plans/${deleteTarget.id}`)
      toast.success(t("planDeactivated"))
      setDeleteTarget(null)
      loadData()
    } catch {
      toast.error(t("deactivateError"))
    } finally {
      setDeleting(false)
    }
  }

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)

  const limitLabel = (v: number | null) => (v == null ? t("unlimited") : String(v))

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" /> {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("subtitle")}
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> {t("newPlan")}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground text-sm">
          {t("noPlans")}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-card border rounded-xl p-5 space-y-4 ${!plan.is_active ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{plan.display_name}</h3>
                  <p className="text-xs text-muted-foreground">{plan.name}</p>
                </div>
                <div className="flex items-center gap-1">
                  {!plan.is_active && <Badge variant="secondary">{t("inactive")}</Badge>}
                  <Badge variant="outline">#{plan.sort_order}</Badge>
                </div>
              </div>

              {plan.description && (
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              )}

              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(Number(plan.price_monthly))}
                  <span className="text-sm font-normal text-muted-foreground">{t("perMonth")}</span>
                </p>
                {plan.price_yearly && Number(plan.price_yearly) > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(Number(plan.price_yearly))}{t("perYear")}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted/50 rounded-lg p-2">
                  <span className="text-muted-foreground">{t("patients")}</span>
                  <p className="font-medium">{limitLabel(plan.max_patients)}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <span className="text-muted-foreground">{t("dentists")}</span>
                  <p className="font-medium">{limitLabel(plan.max_dentists)}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <span className="text-muted-foreground">{t("appointmentsMonth")}</span>
                  <p className="font-medium">{limitLabel(plan.max_appointments_month)}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <span className="text-muted-foreground">{t("ai")}</span>
                  <p className="font-medium">{plan.ai_enabled ? t("yes") : t("no")}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => openEdit(plan)}>
                  <Pencil className="h-3 w-3" /> {t("edit")}
                </Button>
                {plan.is_active && (
                  <Button variant="outline" size="sm" className="gap-1 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(plan)}>
                    <Trash2 className="h-3 w-3" /> {t("deactivate")}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? t("editPlan") : t("newPlanDialog")}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* Identificação */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">{t("identification")}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("nameSlug")}</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t("slugPlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("displayName")}</label>
                  <Input
                    value={form.display_name}
                    onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                    placeholder={t("displayNamePlaceholder")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t("description")}</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder={t("descriptionPlaceholder")}
                  rows={2}
                />
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Preços */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">{t("pricing")}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("priceMonthly")}</label>
                  <Input
                    type="number"
                    value={form.price_monthly}
                    onChange={(e) => setForm({ ...form, price_monthly: Number(e.target.value) })}
                    min={0}
                    step={0.01}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("priceYearly")}</label>
                  <Input
                    type="number"
                    value={form.price_yearly}
                    onChange={(e) => setForm({ ...form, price_yearly: Number(e.target.value) })}
                    min={0}
                    step={0.01}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Limites */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">{t("limits")}</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("maxPatients")}</label>
                  <Input
                    type="number"
                    value={form.max_patients}
                    onChange={(e) => setForm({ ...form, max_patients: e.target.value })}
                    placeholder={t("unlimited")}
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("maxDentists")}</label>
                  <Input
                    type="number"
                    value={form.max_dentists}
                    onChange={(e) => setForm({ ...form, max_dentists: e.target.value })}
                    placeholder={t("unlimited")}
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("maxAppointmentsMonth")}</label>
                  <Input
                    type="number"
                    value={form.max_appointments_month}
                    onChange={(e) => setForm({ ...form, max_appointments_month: e.target.value })}
                    placeholder={t("unlimited")}
                    min={1}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Recursos */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">{t("features")}</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("aiEnabled")}</p>
                    <p className="text-xs text-muted-foreground">{t("aiEnabledDesc")}</p>
                  </div>
                  <Switch
                    checked={form.ai_enabled}
                    onCheckedChange={(checked) => setForm({ ...form, ai_enabled: checked })}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("prioritySupport")}</p>
                    <p className="text-xs text-muted-foreground">{t("prioritySupportDesc")}</p>
                  </div>
                  <Switch
                    checked={form.priority_support}
                    onCheckedChange={(checked) => setForm({ ...form, priority_support: checked })}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("customBranding")}</p>
                    <p className="text-xs text-muted-foreground">{t("customBrandingDesc")}</p>
                  </div>
                  <Switch
                    checked={form.custom_branding}
                    onCheckedChange={(checked) => setForm({ ...form, custom_branding: checked })}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Ordem */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t("sortOrder")}</label>
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                min={0}
                className="max-w-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{t("cancel")}</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {editing ? t("save") : t("create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deactivatePlan")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deactivateMessage", { name: deleteTarget?.display_name || "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {t("deactivate")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
