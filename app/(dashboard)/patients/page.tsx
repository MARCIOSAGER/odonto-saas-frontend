"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState, useMemo } from "react"
import { usePatients } from "@/hooks/usePatients"
import { PatientForm } from "@/components/forms/patient-form"
import { Search, Plus, FilterX, Loader2, Edit2, Trash2 } from "lucide-react"
import { toast } from "sonner"
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

export default function PatientsPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"Todos" | "Ativo" | "Inativo">("Todos")
  const [open, setOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { 
    patients = [], 
    isLoading, 
    createPatient, 
    updatePatient, 
    deletePatient 
  } = usePatients(search, status)

  // Garantir que patients é sempre um array
  const safePatients = useMemo(() => Array.isArray(patients) ? patients : [], [patients])

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
    } catch (error) {
      // Erro já tratado no hook
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

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Pacientes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie o cadastro de pacientes da sua clínica.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={handleCreate}>
              <Plus size={18} />
              Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-100">{editingItem ? "Editar Paciente" : "Novo Paciente"}</DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-gray-400">
                {editingItem 
                  ? "Atualize os dados pessoais e de contato do paciente." 
                  : "Preencha os dados pessoais e de contato do paciente."}
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
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Excluir
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
                placeholder="Buscar por nome, telefone ou CPF..."
                className="pl-10 h-11 bg-muted/30 border-none text-gray-900 dark:text-gray-100 placeholder:text-gray-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="h-11 rounded-md border border-input bg-background px-3 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option>Todos</option>
                <option>Ativo</option>
                <option>Inativo</option>
              </select>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-11 w-11 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                onClick={() => { setSearch(""); setStatus("Todos") }}
                title="Limpar filtros"
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
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <THead className="bg-muted/50">
                  <TR>
                    <TH className="font-bold text-gray-900 dark:text-gray-100">Nome</TH>
                    <TH className="font-bold text-gray-900 dark:text-gray-100">Telefone</TH>
                    <TH className="font-bold text-gray-900 dark:text-gray-100">CPF</TH>
                    <TH className="font-bold text-gray-900 dark:text-gray-100">Status</TH>
                    <TH className="text-right font-bold text-gray-900 dark:text-gray-100">Ações</TH>
                  </TR>
                </THead>
                <TBody>
                  {safePatients.length === 0 ? (
                    <TR>
                      <TD colSpan={5} className="h-32 text-center text-gray-500 dark:text-gray-400">
                        Nenhum paciente encontrado.
                      </TD>
                    </TR>
                  ) : (
                    safePatients.map((p: any) => (
                      <TR key={p.id} className="hover:bg-muted/30 transition-colors">
                        <TD>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                              {(p.name || p.nome || "P").charAt(0)}
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{p.name || p.nome}</span>
                          </div>
                        </TD>
                        <TD className="text-gray-700 dark:text-gray-300">{p.phone || p.telefone}</TD>
                        <TD className="text-gray-700 dark:text-gray-300">{p.cpf || "---"}</TD>
                        <TD>
                          <Badge variant={p.status === "Ativo" ? "green" : "gray"}>
                            {p.status}
                          </Badge>
                        </TD>
                        <TD className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-gray-500 hover:text-primary dark:text-gray-400"
                              onClick={() => handleEdit(p)}
                            >
                              <Edit2 size={14} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-gray-500 hover:text-destructive dark:text-gray-400"
                              onClick={() => setDeleteId(p.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TD>
                      </TR>
                    ))
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
