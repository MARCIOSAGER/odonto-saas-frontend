"use client"
import { Badge } from "@/components/ui/badge"
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useTranslations } from "next-intl"

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

export function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  const t = useTranslations("billing")

  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    paid: { label: t("statusPaid"), variant: "default" },
    pending: { label: t("statusPending"), variant: "secondary" },
    overdue: { label: t("statusOverdue"), variant: "destructive" },
    cancelled: { label: t("statusCancelled"), variant: "outline" },
    refunded: { label: t("statusRefunded"), variant: "outline" },
  }
  if (invoices.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("noInvoices")}
      </div>
    )
  }

  return (
    <Table>
      <THead>
        <TR>
          <TH>{t("invoiceNumber")}</TH>
          <TH>{t("description")}</TH>
          <TH>{t("amount")}</TH>
          <TH>{t("dueDate")}</TH>
          <TH>{t("status")}</TH>
          <TH>{t("nfse")}</TH>
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
                  <span className="text-xs text-muted-foreground">{t("nfseProcessing")}</span>
                ) : invoice.nfse_status === "error" ? (
                  <span className="text-xs text-destructive">{t("nfseError")}</span>
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
