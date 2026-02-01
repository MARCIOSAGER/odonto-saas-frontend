import type { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login"
  },
  providers: [
    Credentials({
      name: "Credenciais",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Handle 2FA completion: email="__2fa__", password="__token__:<access_token>"
        if (credentials.email === "__2fa__" && credentials.password.startsWith("__token__:")) {
          const accessToken = credentials.password.replace("__token__:", "")
          try {
            const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
              headers: { Authorization: `Bearer ${accessToken}` }
            })
            const meData = await meRes.json()
            const profile = meData.data || meData
            if (profile?.id) {
              return {
                id: String(profile.id),
                name: profile.name,
                email: profile.email,
                accessToken,
                role: profile.role,
                clinic_id: profile.clinic?.id
              }
            }
          } catch {
            return null
          }
          return null
        }

        try {
          const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            }),
            headers: { "Content-Type": "application/json" }
          })

          const response = await res.json()

          if (res.ok && response.success && response.data?.access_token) {
            const { data } = response
            return {
              id: String(data.user.id),
              name: data.user.name,
              email: data.user.email,
              accessToken: data.access_token,
              role: data.user.role,
              clinic_id: data.user.clinic_id
            }
          }
          return null
        } catch (error) {
          console.error("Auth authorize error:", error)
          return null
        }
      }
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Handle Google OAuth: exchange Google token for backend tokens
      if (account?.provider === "google" && account.id_token) {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/google-login`, {
            method: 'POST',
            body: JSON.stringify({ google_id_token: account.id_token }),
            headers: { "Content-Type": "application/json" }
          })

          const response = await res.json()
          const data = response.data || response

          if (data?.requires_2fa) {
            if (data?.code_sent === false) {
              return `/login?error=${encodeURIComponent("Não foi possível enviar o código via WhatsApp. Verifique se o WhatsApp está configurado na clínica.")}`
            }
            return `/login/verify-2fa?token=${data.two_factor_token}&method=${data.two_factor_method || 'whatsapp'}`
          }

          if (data?.access_token) {
            ;(user as any).accessToken = data.access_token
            ;(user as any).role = data.user?.role
            ;(user as any).clinic_id = data.clinic?.id
            return true
          }

          // Redirect to login with backend error message
          const errorMsg = response.message || data?.message || "Conta não encontrada. Registre-se primeiro."
          return `/login?error=${encodeURIComponent(errorMsg)}`
        } catch (error) {
          console.error("Google login backend error:", error)
          return `/login?error=${encodeURIComponent("Erro ao conectar com Google. Tente novamente.")}`
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken
        token.id = (user as any).id
        token.role = (user as any).role
        token.clinic_id = (user as any).clinic_id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        ;(session as any).accessToken = token.accessToken
        ;(session as any).user.id = token.id
        ;(session as any).user.role = token.role
        ;(session as any).user.clinic_id = token.clinic_id
      }
      return session
    }
  }
}
