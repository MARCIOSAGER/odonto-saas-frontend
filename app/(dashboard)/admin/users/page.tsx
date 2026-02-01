"use client"
import { useEffect, useState, useCallback } from "react"
import { api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  KeyRound,
  UserCog,
  Shield,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  two_factor_enabled: boolean
  created_at: string
  clinic: { id: string; name: string } | null
}

type ActionType = "toggle_status" | "change_role" | "reset_password"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Action state
  const [actionUser, setActionUser] = useState<User | null>(null)
  const [actionType, setActionType] = useState<ActionType | null>(null)
  const [acting, setActing] = useState(false)
  const [newRole, setNewRole] = useState("")

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", String(page))
      params.set("limit", "20")
      if (search) params.set("search", search)
      if (roleFilter) params.set("role", roleFilter)
      if (statusFilter) params.set("status", statusFilter)

      const res = await api.get(`/admin/users?${params}`)
      const body = res.data?.data || res.data
      setUsers(body?.data || [])
      setTotalPages(body?.meta?.totalPages || 1)
      setTotal(body?.meta?.total || 0)
    } catch {
      toast.error("Erro ao carregar usuários")
    } finally {
      setLoading(false)
    }
  }, [page, search, roleFilter, statusFilter])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    setPage(1)
  }, [search, roleFilter, statusFilter])

  function openAction(user: User, type: ActionType) {
    setActionUser(user)
    setActionType(type)
    if (type === "change_role") setNewRole(user.role)
  }

  function closeAction() {
    setActionUser(null)
    setActionType(null)
    setNewRole("")
  }

  async function handleToggleStatus() {
    if (!actionUser) return
    setActing(true)
    const newStatus = actionUser.status === "active" ? "inactive" : "active"
    try {
      await api.patch(`/admin/users/${actionUser.id}/status`, { status: newStatus })
      toast.success(`Usuário ${newStatus === "active" ? "ativado" : "desativado"}`)
      closeAction()
      loadData()
    } catch {
      toast.error("Erro ao alterar status")
    } finally {
      setActing(false)
    }
  }

  async function handleChangeRole() {
    if (!actionUser || !newRole) return
    setActing(true)
    try {
      await api.patch(`/admin/users/${actionUser.id}/role`, { role: newRole })
      toast.success("Role atualizada")
      closeAction()
      loadData()
    } catch {
      toast.error("Erro ao alterar role")
    } finally {
      setActing(false)
    }
  }

  async function handleResetPassword() {
    if (!actionUser) return
    setActing(true)
    try {
      await api.post(`/admin/users/${actionUser.id}/reset-password`)
      toast.success("Email de redefinição enviado")
      closeAction()
    } catch {
      toast.error("Erro ao enviar email de reset")
    } finally {
      setActing(false)
    }
  }

  const roleBadge = (role: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      superadmin: { label: "Superadmin", variant: "destructive" },
      admin: { label: "Admin", variant: "default" },
      user: { label: "Usuário", variant: "secondary" },
    }
    const r = map[role] || { label: role, variant: "outline" as const }
    return <Badge variant={r.variant}>{r.label}</Badge>
  }

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      active: { label: "Ativo", variant: "default" },
      inactive: { label: "Inativo", variant: "secondary" },
    }
    const s = map[status] || { label: status, variant: "outline" as const }
    return <Badge variant={s.variant}>{s.label}</Badge>
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserCog className="h-6 w-6" /> Usuários
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie os usuários de todas as clínicas ({total} total)
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm bg-background"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-background"
        >
          <option value="">Todas as roles</option>
          <option value="superadmin">Superadmin</option>
          <option value="admin">Admin</option>
          <option value="user">Usuário</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-background"
        >
          <option value="">Todos os status</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground text-sm">
          Nenhum usuário encontrado
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium">Usuário</th>
                  <th className="text-left py-3 px-4 font-medium">Clínica</th>
                  <th className="text-left py-3 px-4 font-medium">Role</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-center py-3 px-4 font-medium">2FA</th>
                  <th className="text-left py-3 px-4 font-medium">Criado em</th>
                  <th className="text-right py-3 px-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {u.clinic?.name || "—"}
                    </td>
                    <td className="py-3 px-4">{roleBadge(u.role)}</td>
                    <td className="py-3 px-4">{statusBadge(u.status)}</td>
                    <td className="py-3 px-4 text-center">
                      {u.two_factor_enabled ? (
                        <ShieldCheck className="h-4 w-4 text-green-600 inline" />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {new Date(u.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          title={u.status === "active" ? "Desativar" : "Ativar"}
                          onClick={() => openAction(u, "toggle_status")}
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Alterar role"
                          onClick={() => openAction(u, "change_role")}
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Resetar senha"
                          onClick={() => openAction(u, "reset_password")}
                        >
                          <KeyRound className="h-4 w-4" />
                        </Button>
                      </div>
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
                Página {page} de {totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Toggle status dialog */}
      <AlertDialog open={actionType === "toggle_status"} onOpenChange={() => closeAction()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionUser?.status === "active" ? "Desativar" : "Ativar"} usuário
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionUser?.status === "active"
                ? `Deseja desativar "${actionUser?.name}"? O usuário não conseguirá fazer login.`
                : `Deseja reativar "${actionUser?.name}"?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleStatus} disabled={acting}>
              {acting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change role dialog */}
      <Dialog open={actionType === "change_role"} onOpenChange={() => closeAction()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar role de {actionUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <p className="text-sm text-muted-foreground">
              Role atual: {actionUser?.role}
            </p>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-background"
            >
              <option value="user">Usuário</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeAction}>Cancelar</Button>
            <Button onClick={handleChangeRole} disabled={acting || newRole === actionUser?.role}>
              {acting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset password dialog */}
      <AlertDialog open={actionType === "reset_password"} onOpenChange={() => closeAction()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resetar senha</AlertDialogTitle>
            <AlertDialogDescription>
              Um email de redefinição de senha será enviado para {actionUser?.email}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPassword} disabled={acting}>
              {acting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Enviar email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
