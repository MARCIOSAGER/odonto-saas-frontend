"use client"
import { Badge } from "@/components/ui/badge"
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Invoice {
  id: string
  number: string
  amount: number
  total: number
  status: string
  due_date: string
  paid_at?: string
  description?: string
  nfse_status?: string
  nfse_pdf_url?: string
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  paid: { label: "Pago", variant: "default" },
  pending: { label: "Pendente", variant: "secondary" },
  overdue: { label: "Vencido", variant: "destructive" },
  cancelled: { label: "Cancelado", variant: "outline" },
  refunded: { label: "Reembolsado", variant: "outline" },
}

export function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  if (invoices.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma fatura encontrada.
      </div>
    )
  }

  return (
    <Table>
      <THead>
        <TR>
          <TH>Fatura</TH>
          <TH>Descrição</TH>
          <TH>Valor</TH>
          <TH>Vencimento</TH>
          <TH>Status</TH>
          <TH>NFS-e</TH>
        </TR>
      </THead>
      <TBody>
        {invoices.map((invoice) => {
          const status = statusMap[invoice.status] || statusMap.pending
          return (
            <TR key={invoice.id}>
              <TD className="font-mono text-sm">
                {invoice.number}
              </TD>
              <TD>{invoice.description || "—"}</TD>
              <TD>
                R$ {Number(invoice.total).toFixed(2)}
              </TD>
              <TD>
                {format(new Date(invoice.due_date), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </TD>
              <TD>
                <Badge variant={status.variant}>{status.label}</Badge>
              </TD>
              <TD>
                {invoice.nfse_pdf_url ? (
                  <a
                    href={invoice.nfse_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    PDF
                  </a>
                ) : invoice.nfse_status === "pending" ? (
                  <span className="text-xs text-muted-foreground">Processando</span>
                ) : invoice.nfse_status === "error" ? (
                  <span className="text-xs text-destructive">Erro</span>
                ) : (
                  "—"
                )}
              </TD>
            </TR>
          )
        })}
      </TBody>
    </Table>
  )
}
