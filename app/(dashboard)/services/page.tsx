"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table"
import { useServices } from "@/hooks/useServices"
import { Plus, Loader2, Trash2, DollarSign, Clock, Settings2 } from "lucide-react"

export default function ServicesPage() {
  const { services, isLoading, deleteService } = useServices()

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Serviços</h1>
          <p className="text-sm text-muted-foreground">Configure os procedimentos e valores da clínica.</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          Novo Serviço
        </Button>
      </div>

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
                    <TH className="font-semibold text-foreground">Procedimento</TH>
                    <TH className="font-semibold text-foreground text-center">Duração</TH>
                    <TH className="font-semibold text-foreground text-right">Preço</TH>
                    <TH className="text-right font-semibold text-foreground">Ações</TH>
                  </TR>
                </THead>
                <TBody>
                  {services.length === 0 ? (
                    <TR>
                      <TD colSpan={4} className="h-32 text-center text-muted-foreground">
                        Nenhum serviço cadastrado.
                      </TD>
                    </TR>
                  ) : (
                    services.map((s) => (
                      <TR key={s.id} className="hover:bg-muted/30 transition-colors">
                        <TD>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600">
                              <Settings2 size={16} />
                            </div>
                            <span className="font-medium text-foreground">{s.nome}</span>
                          </div>
                        </TD>
                        <TD className="text-center">
                          <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-sm">
                            <Clock size={14} />
                            {s.duracao} min
                          </div>
                        </TD>
                        <TD className="text-right">
                          <div className="flex items-center justify-end gap-1.5 font-semibold text-foreground">
                            <span className="text-xs text-muted-foreground font-normal">R$</span>
                            {s.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </TD>
                        <TD className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              if (confirm("Remover este serviço?")) deleteService.mutate(s.id)
                            }}
                          >
                            <Trash2 size={14} />
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
