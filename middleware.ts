import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const PUBLIC_PATHS = ["/", "/pricing", "/terms", "/privacy"]
const AUTH_PATHS = ["/login", "/register", "/forgot-password", "/login/verify-2fa"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  const isPublicPage = PUBLIC_PATHS.includes(pathname)
  const isPortalPage = pathname.startsWith("/p/")
  const isNpsPage = pathname.startsWith("/nps/")
  const isAuthPage = AUTH_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  )

  // Páginas públicas, portal do paciente e de autenticação: sempre acessíveis
  if (isPublicPage || isPortalPage || isNpsPage) {
    return NextResponse.next()
  }

  // Se estiver logado e tentar acessar login/register, manda pro home
  if (isAuthPage && token) {
    const url = new URL("/home", req.url)
    return NextResponse.redirect(url)
  }

  // Páginas de auth sem token: libera normalmente (login, register, etc.)
  if (isAuthPage) {
    return NextResponse.next()
  }

  // Todas as outras rotas (dashboard) exigem autenticação
  if (!token) {
    const url = new URL("/login", req.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/pricing",
    "/terms",
    "/privacy",
    "/login",
    "/login/verify-2fa",
    "/register",
    "/forgot-password",
    "/forgot-password/reset",
    "/home",
    "/appointments/:path*",
    "/clinics/:path*",
    "/conversations/:path*",
    "/dentists/:path*",
    "/patients/:path*",
    "/services/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/onboarding/:path*",
    "/reports/:path*",
    "/nps/:path*",
    "/p/:path*"
  ]
}
