"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sparkles,
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  Loader2,
  Plus,
  Search,
  Eye,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import {
  useHofDashboard,
  useHofRecentProcedures,
  useHofLegend,
  PROCEDURE_TYPE_LABELS,
  FACIAL_REGION_LABELS,
  HofProcedureType,
} from "@/hooks/useHof"
import { formatCurrency, formatDate } from "@/lib/format-utils"

export default function HofPage() {
  const t = useTranslations("hof")
  const tc = useTranslations("common")
  const router = useRouter()

  const [page, setPage] = useState(1)
  const [procedureTypeFilter, setProcedureTypeFilter] = useState<string>("__all__")

  const { data: dashboard, isLoading: loadingDashboard } = useHofDashboard()
  const { data: procedures, isLoading: loadingProcedures } = useHofRecentProcedures({
    page,
    limit: 10,
    procedureType: procedureTypeFilter === "__all__" ? undefined : procedureTypeFilter as HofProcedureType,
  })
  const { data: legend } = useHofLegend()

  // Create a color map from legend
  const colorMap = new Map(
    legend?.map((item) => [item.procedure_type, item.color]) || []
  )

  if (loadingDashboard) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            {t("title")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("subtitle")}
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          {t("newProcedure")}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("totalProcedures")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.totalProcedures || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("totalRevenue")}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboard?.totalRevenue || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("totalPatients")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.totalPatients || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("scheduledSessions")}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.scheduledSessions || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Procedures */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>{t("recentProcedures")}</CardTitle>
            <div className="flex gap-2">
              <Select
                value={procedureTypeFilter}
                onValueChange={setProcedureTypeFilter}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={t("filterByType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">{tc("all")}</SelectItem>
                  {Object.entries(PROCEDURE_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loadingProcedures ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table className="min-w-[800px]">
                <THead className="bg-muted/50">
                  <TR>
                    <TH>{tc("date")}</TH>
                    <TH>{t("patient")}</TH>
                    <TH>{t("procedure")}</TH>
                    <TH>{t("region")}</TH>
                    <TH>{t("product")}</TH>
                    <TH>{tc("status")}</TH>
                    <TH className="text-right">{tc("actions")}</TH>
                  </TR>
                </THead>
                <TBody>
                  {!procedures?.data?.length ? (
                    <TR>
                      <TD colSpan={7} className="h-32 text-center text-muted-foreground">
                        {t("noProcedures")}
                      </TD>
                    </TR>
                  ) : (
                    procedures.data.map((proc: any) => (
                      <TR key={proc.id} className="hover:bg-muted/30">
                        <TD className="font-medium">
                          {formatDate(proc.date)}
                        </TD>
                        <TD>
                          <button
                            className="text-primary hover:underline"
                            onClick={() => router.push(`/patients/${proc.patientId}`)}
                          >
                            {proc.patientName}
                          </button>
                        </TD>
                        <TD>
                          <Badge
                            style={{
                              backgroundColor: colorMap.get(proc.procedureType) || "#6B7280",
                              color: "white",
                            }}
                          >
                            {PROCEDURE_TYPE_LABELS[proc.procedureType as HofProcedureType] ||
                              proc.procedureType}
                          </Badge>
                        </TD>
                        <TD>
                          {FACIAL_REGION_LABELS[proc.facialRegion as keyof typeof FACIAL_REGION_LABELS] ||
                            proc.facialRegion}
                        </TD>
                        <TD className="text-muted-foreground">
                          {proc.productName || "—"}
                        </TD>
                        <TD>
                          <Badge
                            variant={proc.status === "completed" ? "green" : "secondary"}
                          >
                            {proc.status === "completed" ? t("statusCompleted") : proc.status}
                          </Badge>
                        </TD>
                        <TD className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => router.push(`/patients/${proc.patientId}?tab=hof`)}
                          >
                            <Eye size={14} />
                          </Button>
                        </TD>
                      </TR>
                    ))
                  )}
                </TBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {procedures?.meta && procedures.meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                {t("showingPage", {
                  page: procedures.meta.page,
                  total: procedures.meta.totalPages,
                })}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  {tc("previous")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= procedures.meta.totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  {tc("next")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      {legend && legend.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("legend")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {legend.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
