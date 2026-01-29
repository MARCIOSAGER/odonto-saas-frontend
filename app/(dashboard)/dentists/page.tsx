"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table"
import { useDentists } from "@/hooks/useDentists"
import { Plus, Loader2, Trash2, UserCheck, IdCard, Stethoscope } from "lucide-react"
import { DentistForm } from "@/components/forms/dentist-form"
import { toast } from "sonner"

export default function DentistsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { dentists, isLoading, createDentist, deleteDentist } = useDentists()

  const handleCreateDentist = async (data: any) => {
    try {
      await createDentist.mutateAsync(data)
      setIsModalOpen(false)
      toast.success("Dentista cadastrado com sucesso!")
    } catch (error) {
      toast.error("Erro ao cadastrar dentista")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este profissional?")) return
    try {
      await deleteDentist.mutateAsync(id)
      toast.success("Profissional removido!")
    } catch (error) {
      toast.error("Erro ao remover profissional")
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Dentistas</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Corpo clínico e profissionais da clínica.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Novo Dentista
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Novo Dentista</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Preencha as informações do novo profissional para cadastrá-lo no sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-0">
            <DentistForm 
              onSubmit={handleCreateDentist}
              onCancel={() => setIsModalOpen(false)}
              loading={createDentist.isPending}
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
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-500 hover:text-destructive dark:text-gray-400"
                            onClick={() => handleDelete(d.id)}
                            disabled={deleteDentist.isPending}
                          >
                            {deleteDentist.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
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
