"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table"
import { useServices } from "@/hooks/useServices"
import { Plus, Loader2, Trash2, Clock, Settings2 } from "lucide-react"
import { ServiceForm } from "@/components/forms/service-form"
import { toast } from "sonner"

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { services, isLoading, createService, deleteService } = useServices()

  const handleCreateService = async (data: any) => {
    try {
      await createService.mutateAsync(data)
      setIsModalOpen(false)
      toast.success("Serviço criado com sucesso!")
    } catch (error) {
      toast.error("Erro ao criar serviço")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente remover este serviço?")) return
    try {
      await deleteService.mutateAsync(id)
      toast.success("Serviço removido!")
    } catch (error) {
      toast.error("Erro ao remover serviço")
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Serviços</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure os procedimentos e valores da clínica.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Novo Serviço
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Novo Serviço</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Cadastre um novo procedimento com nome, duração e preço.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-0">
            <ServiceForm 
              onSubmit={handleCreateService}
              onCancel={() => setIsModalOpen(false)}
              loading={createService.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>

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
                  {!Array.isArray(services) || services.length === 0 ? (
                    <TR>
                      <TD colSpan={4} className="h-32 text-center text-gray-500 dark:text-gray-400">
                        Nenhum serviço cadastrado.
                      </TD>
                    </TR>
                  ) : (
                    services.map((s: any) => (
                      <TR key={s.id} className="hover:bg-muted/30 transition-colors">
                        <TD>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600">
                              <Settings2 size={16} />
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{s.nome}</span>
                          </div>
                        </TD>
                        <TD className="text-center">
                          <div className="flex items-center justify-center gap-1.5 text-gray-700 dark:text-gray-300 text-sm">
                            <Clock size={14} />
                            {s.duracao} min
                          </div>
                        </TD>
                        <TD className="text-right">
                          <div className="flex items-center justify-end gap-1.5 font-semibold text-gray-900 dark:text-gray-100">
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">R$</span>
                            {(s.preco || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </TD>
                        <TD className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-500 hover:text-destructive dark:text-gray-400"
                            onClick={() => handleDelete(s.id)}
                            disabled={deleteService.isPending}
                          >
                            {deleteService.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </Button>
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
