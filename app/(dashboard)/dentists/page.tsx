"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table"
import { useDentists } from "@/hooks/useDentists"
import { Plus, Loader2, Trash2, UserCheck, IdCard, Stethoscope, Pencil } from "lucide-react"
import { DentistForm } from "@/components/forms/dentist-form"
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

export default function DentistsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { dentists, isLoading, createDentist, deleteDentist, updateDentist } = useDentists()

  const handleCreate = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingItem) {
        await updateDentist.mutateAsync({ id: editingItem.id, ...data })
      } else {
        await createDentist.mutateAsync(data)
      }
      setIsModalOpen(false)
      setEditingItem(null)
    } catch (error) {
      // Erro já tratado no hook
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteDentist.mutateAsync(deleteId)
    } catch (error) {
      // Erro já tratado no hook
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Dentistas</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Corpo clínico e profissionais da clínica.</p>
        </div>
        <Button className="gap-2" onClick={handleCreate}>
          <Plus size={18} />
          Novo Dentista
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              {editingItem ? "Editar Dentista" : "Novo Dentista"}
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              {editingItem 
                ? "Atualize as informações do profissional selecionado." 
                : "Preencha as informações do novo profissional para cadastrá-lo no sistema."}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-0">
            <DentistForm 
              initialData={editingItem}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsModalOpen(false)}
              loading={createDentist.isPending || updateDentist.isPending}
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

      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <THead className="bg-muted/50">
                  <TR>
                    <TH className="font-bold text-gray-900 dark:text-gray-100">Nome Profissional</TH>
                    <TH className="font-bold text-gray-900 dark:text-gray-100">CRO</TH>
                    <TH className="font-bold text-gray-900 dark:text-gray-100">Especialidade</TH>
                    <TH className="text-right font-bold text-gray-900 dark:text-gray-100">Ações</TH>
                  </TR>
                </THead>
                <TBody>
                  {!Array.isArray(dentists) || dentists.length === 0 ? (
                    <TR>
                      <TD colSpan={4} className="h-32 text-center text-gray-500 dark:text-gray-400">
                        Nenhum dentista cadastrado.
                      </TD>
                    </TR>
                  ) : (
                    dentists.map((d: any) => (
                      <TR key={d.id} className="hover:bg-muted/30 transition-colors">
                        <TD>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              <UserCheck size={18} />
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{d.name || d.nome}</span>
                          </div>
                        </TD>
                        <TD>
                          <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 text-sm">
                            <IdCard size={14} />
                            {d.cro}
                          </div>
                        </TD>
                        <TD>
                          <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 text-sm">
                            <Stethoscope size={14} />
                            {d.specialty || d.especialidade}
                          </div>
                        </TD>
                        <TD className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-gray-500 hover:text-primary dark:text-gray-400"
                              onClick={() => handleEdit(d)}
                            >
                              <Pencil size={14} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-gray-500 hover:text-destructive dark:text-gray-400"
                              onClick={() => setDeleteId(d.id)}
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
