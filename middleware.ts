import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  const isAuthPage = pathname === "/login" || pathname === "/register"
  const isPublicPage = pathname === "/"

  // Se for uma página interna e não tiver token, manda pro login
  if (!isAuthPage && !isPublicPage && !token) {
    const url = new URL("/login", req.url)
    return NextResponse.redirect(url)
  }

  // Se estiver logado e tentar acessar login/register, manda pro home
  if (isAuthPage && token) {
    const url = new URL("/home", req.url)
    return NextResponse.redirect(url)
  }

  // Redirect raiz para home
  if (pathname === "/") {
    const url = new URL("/home", req.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/home",
    "/appointments/:path*",
    "/clinics/:path*",
    "/conversations/:path*",
    "/dentists/:path*",
    "/patients/:path*",
    "/services/:path*",
    "/settings/:path*"
  ]
}
