"use client"
import { useEffect, useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Loader2,
  Hospital,
  Users,
  Search,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  CalendarDays,
} from "lucide-react"
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
import { toast } from "sonner"

interface Clinic {
  id: string
  name: string
  cnpj: string
  phone: string
  email: string
  plan: string
  status: string
  created_at: string
  _count: {
    patients: number
    dentists: number
    appointments: number
    users: number
  }
}

interface Stats {
  total_clinics: number
  active_clinics: number
  inactive_clinics: number
  total_users: number
  active_users: number
}

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [toggleTarget, setToggleTarget] = useState<Clinic | null>(null)
  const [toggling, setToggling] = useState(false)
  const t = useTranslations("clinics")
  const tc = useTranslations("common")
  const locale = useLocale()

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", String(page))
      params.set("limit", "15")
      if (search) params.set("search", search)
      if (statusFilter) params.set("status", statusFilter)

      const [clinicsRes, statsRes] = await Promise.all([
        api.get(`/admin/clinics?${params}`),
        api.get("/admin/stats"),
      ])

      const clinicsBody = clinicsRes.data?.data || clinicsRes.data
      setClinics(clinicsBody?.data || [])
      setTotalPages(clinicsBody?.meta?.totalPages || 1)

      setStats(statsRes.data?.data || statsRes.data)
    } catch {
      toast.error(t("loadError"))
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter])

  async function handleToggleStatus() {
    if (!toggleTarget) return
    setToggling(true)
    const newStatus = toggleTarget.status === "active" ? "inactive" : "active"
    try {
      await api.patch(`/admin/clinics/${toggleTarget.id}/status`, { status: newStatus })
      toast.success(newStatus === "active" ? t("clinicActivated") : t("clinicDeactivated"))
      setToggleTarget(null)
      loadData()
    } catch {
      toast.error(t("statusError"))
    } finally {
      setToggling(false)
    }
  }

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      active: { label: t("statusActive"), variant: "default" },
      inactive: { label: t("statusInactive"), variant: "secondary" },
      suspended: { label: t("statusSuspended"), variant: "destructive" },
    }
    const s = map[status] || { label: status, variant: "outline" as const }
    return <Badge variant={s.variant}>{s.label}</Badge>
  }

  const planBadge = (plan: string) => {
    const map: Record<string, string> = {
      basic: "Basic",
      standard: "Standard",
      premium: "Premium",
    }
    return <Badge variant="outline">{map[plan] || plan}</Badge>
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Hospital className="h-6 w-6" /> {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("subtitle")}
        </p>
      </div>

      {/* KPIs */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <Hospital className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("kpiTotal")}</p>
                  <p className="text-2xl font-bold">{stats.total_clinics}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("kpiActive")}</p>
                  <p className="text-2xl font-bold">{stats.active_clinics}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                  <UserX className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("kpiInactive")}</p>
                  <p className="text-2xl font-bold">{stats.inactive_clinics}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                  <Users className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("kpiUsers")}</p>
                  <p className="text-2xl font-bold">{stats.total_users}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm bg-background"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-background"
        >
          <option value="">{t("allStatuses")}</option>
          <option value="active">{t("filterActive")}</option>
          <option value="inactive">{t("filterInactive")}</option>
          <option value="suspended">{t("filterSuspended")}</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : clinics.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground text-sm">
          {t("noClinics")}
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium">{t("colClinic")}</th>
                  <th className="text-left py-3 px-4 font-medium">{t("colCnpj")}</th>
                  <th className="text-left py-3 px-4 font-medium">{t("colPlan")}</th>
                  <th className="text-left py-3 px-4 font-medium">{t("colStatus")}</th>
                  <th className="text-center py-3 px-4 font-medium">
                    <span title={t("tooltipPatients")}><Users className="h-4 w-4 inline" /></span>
                  </th>
                  <th className="text-center py-3 px-4 font-medium">
                    <span title={t("tooltipDentists")}><Stethoscope className="h-4 w-4 inline" /></span>
                  </th>
                  <th className="text-center py-3 px-4 font-medium">
                    <span title={t("tooltipAppointments")}><CalendarDays className="h-4 w-4 inline" /></span>
                  </th>
                  <th className="text-left py-3 px-4 font-medium">{t("colCreatedAt")}</th>
                  <th className="text-right py-3 px-4 font-medium">{t("colActions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {clinics.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{c.cnpj}</td>
                    <td className="py-3 px-4">{planBadge(c.plan)}</td>
                    <td className="py-3 px-4">{statusBadge(c.status)}</td>
                    <td className="py-3 px-4 text-center">{c._count.patients}</td>
                    <td className="py-3 px-4 text-center">{c._count.dentists}</td>
                    <td className="py-3 px-4 text-center">{c._count.appointments}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {new Date(c.created_at).toLocaleDateString(locale)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant={c.status === "active" ? "outline" : "default"}
                        size="sm"
                        onClick={() => setToggleTarget(c)}
                      >
                        {c.status === "active" ? t("deactivate") : t("activate")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {t("pageOf", { page, totalPages })}
              </span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Confirm toggle dialog */}
      <AlertDialog open={!!toggleTarget} onOpenChange={() => setToggleTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {toggleTarget?.status === "active" ? t("deactivateClinic") : t("activateClinic")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {toggleTarget?.status === "active"
                ? t("deactivateMessage", { name: toggleTarget?.name ?? "" })
                : t("activateMessage", { name: toggleTarget?.name ?? "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tc("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleStatus} disabled={toggling}>
              {toggling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {tc("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
