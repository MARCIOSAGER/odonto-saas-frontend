"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { useState } from "react"
import { usePatients } from "@/hooks/usePatients"
import { PatientForm } from "@/components/forms/patient-form"
import { Search, Plus, FilterX, Loader2, Edit2, Trash2, User } from "lucide-react"

export default function PatientsPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"Todos" | "Ativo" | "Inativo">("Todos")
  const [open, setOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<any>(null)

  const { 
    patients, 
    isLoading, 
    createPatient, 
    updatePatient, 
    deletePatient 
  } = usePatients(search, status)

  const handleEdit = (patient: any) => {
    setEditingPatient(patient)
    setOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja remover este paciente?")) {
      await deletePatient.mutateAsync(id)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setEditingPatient(null)
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Pacientes</h1>
          <p className="text-sm text-muted-foreground">Gerencie o cadastro de pacientes da sua clínica.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} />
              Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader title={editingPatient ? "Editar Paciente" : "Novo Paciente"} />
            <div className="p-6 pt-0">
              <PatientForm
                initialData={editingPatient}
                onSubmit={(v) => {
                  if (editingPatient) {
                    updatePatient.mutate({ id: editingPatient.id, ...v })
                  } else {
                    createPatient.mutate(v)
                  }
                  handleClose()
                }}
                onCancel={handleClose}
                loading={createPatient.isPending || updatePatient.isPending}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, telefone ou CPF..."
                className="pl-10 h-11 bg-muted/30 border-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="h-11 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20"
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
                className="h-11 w-11 text-muted-foreground hover:text-foreground"
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
                    <TH className="font-semibold text-foreground">Nome</TH>
                    <TH className="font-semibold text-foreground">Telefone</TH>
                    <TH className="font-semibold text-foreground">CPF</TH>
                    <TH className="font-semibold text-foreground">Status</TH>
                    <TH className="text-right font-semibold text-foreground">Ações</TH>
                  </TR>
                </THead>
                <TBody>
                  {patients.length === 0 ? (
                    <TR>
                      <TD colSpan={5} className="h-32 text-center text-muted-foreground">
                        Nenhum paciente encontrado.
                      </TD>
                    </TR>
                  ) : (
                    patients.map((p: any) => (
                      <TR key={p.id} className="hover:bg-muted/30 transition-colors">
                        <TD>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                              {p.nome.charAt(0)}
                            </div>
                            <span className="font-medium text-foreground">{p.nome}</span>
                          </div>
                        </TD>
                        <TD className="text-muted-foreground">{p.telefone}</TD>
                        <TD className="text-muted-foreground">{p.cpf || "---"}</TD>
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
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={() => handleEdit(p)}
                            >
                              <Edit2 size={14} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDelete(p.id)}
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
