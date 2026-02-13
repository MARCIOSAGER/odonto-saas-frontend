import axios from "axios"
import { getSession } from "next-auth/react"
import { env } from "@/lib/env"

const baseURL = env.apiUrl

export const api = axios.create({
  baseURL
})

api.interceptors.request.use(async (config) => {
  // Token obtido via NextAuth session (httpOnly cookie no servidor)
  // O accessToken está no session object por necessidade do interceptor client-side.
  // Para isolamento total, seria necessário um proxy server-side (/api/proxy/).
  const session = await getSession()
  const token = (session as any)?.accessToken
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    // Redirect to login on 401 (expired/blacklisted token)
    if (
      error?.response?.status === 401 &&
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/login")
    ) {
      const { signOut } = await import("next-auth/react")
      signOut({ callbackUrl: "/login?reason=expired" })
      return Promise.reject(error)
    }
    console.error("API Error:", error?.response?.data || error.message)
    return Promise.reject(error)
  }
)

export type ApiError = {
  message?: string
  status?: number
}

/**
 * Converte URLs relativas de uploads (/uploads/...) para URL completa do backend.
 * Necessário porque frontend e backend estão em domínios diferentes.
 */
export function getUploadUrl(path: string | null | undefined): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const apiUrl = env.apiUrl
  try {
    const url = new URL(apiUrl)
    const backendBase = url.origin // "https://api-odonto.marciosager.com"
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${backendBase}${normalizedPath}`
  } catch {
    // Fallback caso a URL seja inválida
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${apiUrl}${normalizedPath}`
  }
}
