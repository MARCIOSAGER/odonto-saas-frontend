"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table"
import { useDentists } from "@/hooks/useDentists"
import { Plus, Loader2, Trash2, UserCheck, IdCard, Stethoscope } from "lucide-react"

export default function DentistsPage() {
  const { dentists, isLoading, deleteDentist } = useDentists()

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dentistas</h1>
          <p className="text-sm text-muted-foreground">Corpo clínico e profissionais da clínica.</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          Novo Dentista
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
                    <TH className="font-semibold text-foreground">Nome Profissional</TH>
                    <TH className="font-semibold text-foreground">CRO</TH>
                    <TH className="font-semibold text-foreground">Especialidade</TH>
                    <TH className="text-right font-semibold text-foreground">Ações</TH>
                  </TR>
                </THead>
                <TBody>
                  {dentists.length === 0 ? (
                    <TR>
                      <TD colSpan={4} className="h-32 text-center text-muted-foreground">
                        Nenhum dentista cadastrado.
                      </TD>
                    </TR>
                  ) : (
                    dentists.map((d) => (
                      <TR key={d.id} className="hover:bg-muted/30 transition-colors">
                        <TD>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              <UserCheck size={18} />
                            </div>
                            <span className="font-medium text-foreground">{d.nome}</span>
                          </div>
                        </TD>
                        <TD>
                          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                            <IdCard size={14} />
                            {d.cro}
                          </div>
                        </TD>
                        <TD>
                          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                            <Stethoscope size={14} />
                            {d.especialidade}
                          </div>
                        </TD>
                        <TD className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              if (confirm("Remover este profissional?")) deleteDentist.mutate(d.id)
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
