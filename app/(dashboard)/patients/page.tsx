"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { usePatients } from "@/hooks/usePatients"
import { PatientForm } from "@/components/forms/patient-form"
import { Search, Plus, FilterX, Loader2, Edit2, Trash2, Eye } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
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
import { translatePatientStatus, getPatientStatusVariant, getPatientDisplayName, getPatientPhone, getPatientCpf } from "@/lib/patient-utils"

export default function PatientsPage() {
  const t = useTranslations("patients")
  const tc = useTranslations("common")
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"Todos" | "Ativo" | "Inativo">("Todos")
  const [open, setOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { 
    patients, 
    isLoading, 
    isError,
    createPatient, 
    updatePatient, 
    deletePatient 
  } = usePatients(search, status)

  // Garantir que patients é sempre um array
  const safePatients = useMemo(() => {
    if (!patients) return []
    if (Array.isArray(patients)) return patients
    return []
  }, [patients])

  const handleCreate = () => {
    setEditingItem(null)
    setOpen(true)
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deletePatient.mutateAsync(deleteId)
      toast.success(t("deleteSuccess"))
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("deleteError"))
    } finally {
      setDeleteId(null)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setEditingItem(null)
  }

  const handleSubmit = async (v: any) => {
    try {
      if (editingItem) {
        await updatePatient.mutateAsync({ id: editingItem.id, ...v })
      } else {
        await createPatient.mutateAsync(v)
      }
      handleClose()
    } catch (error) {
      // Erro já tratado no hook
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-destructive font-medium">{t("loadError")}</div>
        <Button onClick={() => window.location.reload()} variant="outline">
          {tc("tryAgain")}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{t("title")}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("subtitle")}</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={handleCreate}>
              <Plus size={18} />
              {t("newPatient")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-100">{editingItem ? t("editPatient") : t("newPatient")}</DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-gray-400">
                {editingItem ? t("formSubtitleEdit") : t("formSubtitleNew")}
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 pt-0">
              <PatientForm
                initialData={editingItem}
                onSubmit={handleSubmit}
                onCancel={handleClose}
                loading={createPatient.isPending || updatePatient.isPending}
              />
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{tc("deleteConfirmTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {tc("deleteConfirmMessage")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{tc("cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                {tc("delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder={t("searchPlaceholder")}
                className="pl-10 h-11 bg-muted/30 border-none text-gray-900 dark:text-gray-100 placeholder:text-gray-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="h-11 min-w-[100px] rounded-md border border-input bg-background px-3 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="Todos">{tc("all")}</option>
                <option value="Ativo">{t("active")}</option>
                <option value="Inativo">{t("inactive")}</option>
              </select>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-11 w-11 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                onClick={() => { setSearch(""); setStatus("Todos") }}
                title={tc("clearFilters")}
              >
                <FilterX size={18} />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border border-border overflow-x-auto">
              <Table className="min-w-[640px]">
                <THead className="bg-muted/50">
                  <TR>
                    <TH className="font-bold text-gray-900 dark:text-gray-100">{tc("name")}</TH>
                    <TH className="font-bold text-gray-900 dark:text-gray-100">{tc("phone")}</TH>
                    <TH className="font-bold text-gray-900 dark:text-gray-100">{t("cpf")}</TH>
                    <TH className="font-bold text-gray-900 dark:text-gray-100">{tc("status")}</TH>
                    <TH className="text-right font-bold text-gray-900 dark:text-gray-100">{tc("actions")}</TH>
                  </TR>
                </THead>
                <TBody>
                  {safePatients.length === 0 ? (
                    <TR>
                      <TD colSpan={5} className="h-32 text-center text-gray-500 dark:text-gray-400">
                        {t("noPatients")}
                      </TD>
                    </TR>
                  ) : (
                    safePatients.map((p: any) => {
                      const displayName = getPatientDisplayName(p)
                      const displayPhone = getPatientPhone(p)
                      const displayCpf = getPatientCpf(p)
                      const displayStatus = translatePatientStatus(p.status)
                      const statusVariant = getPatientStatusVariant(p.status)

                      return (
                      <TR key={p.id} className="hover:bg-muted/30 transition-colors">
                        <TD>
                          <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => router.push(`/patients/${p.id}`)}
                          >
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                              {displayName.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-gray-100 hover:text-primary transition-colors">{displayName}</span>
                          </div>
                        </TD>
                        <TD className="text-gray-700 dark:text-gray-300">{displayPhone}</TD>
                        <TD className="text-gray-700 dark:text-gray-300">{displayCpf}</TD>
                        <TD>
                          <Badge variant={statusVariant}>
                            {displayStatus}
                          </Badge>
                        </TD>
                        <TD className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-primary dark:text-gray-400"
                              onClick={() => router.push(`/patients/${p.id}`)}
                              title={tc("viewDetails")}
                            >
                              <Eye size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-primary dark:text-gray-400"
                              onClick={() => handleEdit(p)}
                              title={tc("edit")}
                            >
                              <Edit2 size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-destructive dark:text-gray-400"
                              onClick={() => setDeleteId(p.id)}
                              title={tc("delete")}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TD>
                      </TR>
                    )})
                  )}
                </TBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
