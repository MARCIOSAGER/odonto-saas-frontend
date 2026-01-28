import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const url = new URL("/login", req.url)
      return NextResponse.redirect(url)
    }
  }
  if (pathname === "/login" && token) {
    const url = new URL("/home", req.url)
    return NextResponse.redirect(url)
  }
  if (pathname === "/") {
    const url = new URL("/home", req.url)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"]
}
