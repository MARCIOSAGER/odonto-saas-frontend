"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table"
import { useServices } from "@/hooks/useServices"
import { Plus, Loader2, Trash2, Clock, Settings2, Pencil } from "lucide-react"
import { ServiceForm } from "@/components/forms/service-form"
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

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { services, isLoading, isError, createService, deleteService, updateService } = useServices()

  // Garantir que services é sempre um array
  const safeServices = useMemo(() => {
    if (!services) return []
    if (Array.isArray(services)) return services
    return []
  }, [services])

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
        await updateService.mutateAsync({ id: editingItem.id, ...data })
      } else {
        await createService.mutateAsync(data)
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
      console.log('Deletando serviço:', deleteId)
      await deleteService.mutateAsync(deleteId)
      toast.success("Serviço excluído com sucesso!")
    } catch (error: any) {
      console.error('Erro ao excluir serviço:', error)
      toast.error(error.response?.data?.message || "Erro ao excluir serviço")
    } finally {
      setDeleteId(null)
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
        <div className="text-destructive font-medium">Erro ao carregar serviços</div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Serviços</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure os procedimentos e valores da clínica.</p>
        </div>
        <Button className="gap-2" onClick={handleCreate}>
          <Plus size={18} />
          Novo Serviço
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              {editingItem ? "Editar Serviço" : "Novo Serviço"}
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              {editingItem 
                ? "Atualize as informações do procedimento selecionado." 
                : "Cadastre um novo procedimento com nome, duração e preço."}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-0">
            <ServiceForm 
              initialData={editingItem}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsModalOpen(false)}
              loading={createService.isPending || updateService.isPending}
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
                    <TH className="font-bold text-gray-900 dark:text-gray-100">Procedimento</TH>
                    <TH className="font-bold text-gray-900 dark:text-gray-100 text-center">Duração</TH>
                    <TH className="font-bold text-gray-900 dark:text-gray-100 text-right">Preço</TH>
                    <TH className="text-right font-bold text-gray-900 dark:text-gray-100">Ações</TH>
                  </TR>
                </THead>
                <TBody>
                  {safeServices.length === 0 ? (
                    <TR>
                      <TD colSpan={4} className="h-32 text-center text-gray-500 dark:text-gray-400">
                        Nenhum serviço cadastrado.
                      </TD>
                    </TR>
                  ) : (
                    safeServices.map((s: any) => (
                      <TR key={s.id} className="hover:bg-muted/30 transition-colors">
                        <TD>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600">
                              <Settings2 size={16} />
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{s.name || s.nome}</span>
                          </div>
                        </TD>
                        <TD className="text-center">
                          <div className="flex items-center justify-center gap-1.5 text-gray-700 dark:text-gray-300 text-sm">
                            <Clock size={14} />
                            {s.duration || s.duracao} min
                          </div>
                        </TD>
                        <TD className="text-right">
                          <div className="flex items-center justify-end gap-1.5 font-semibold text-gray-900 dark:text-gray-100">
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">R$</span>
                            {(s.price || s.preco || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </TD>
                        <TD className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-gray-500 hover:text-primary dark:text-gray-400"
                              onClick={() => handleEdit(s)}
                            >
                              <Pencil size={14} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-gray-500 hover:text-destructive dark:text-gray-400"
                              onClick={() => setDeleteId(s.id)}
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
