"use client"
import { useSession } from "next-auth/react"

const DEFAULT_PERMISSIONS: Record<string, string[]> = {
  superadmin: ["*"],
  admin: [
    "patients:read", "patients:write",
    "appointments:manage", "dentists:manage",
    "services:manage", "reports:view",
    "settings:manage", "billing:manage",
    "conversations:manage",
  ],
  user: [
    "patients:read", "patients:write",
    "appointments:manage", "reports:view",
    "conversations:manage",
  ],
}

export function usePermissions() {
  const { data: session } = useSession()
  const user = session?.user as any
  const role = user?.role || "user"

  const permissions: string[] =
    user?.permissions && user.permissions.length > 0
      ? user.permissions
      : DEFAULT_PERMISSIONS[role] || []

  const hasPermission = (permission: string): boolean => {
    if (role === "superadmin") return true
    if (permissions.includes("*")) return true
    return permissions.includes(permission)
  }

  const hasAnyPermission = (perms: string[]): boolean => {
    return perms.some((p) => hasPermission(p))
  }

  return { permissions, hasPermission, hasAnyPermission, role }
}
