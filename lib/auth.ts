import type { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-odonto.marciosager.com/api/v1"

export const authOptions: NextAuthOptions = {
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
        
        try {
          // Chamar o endpoint real do backend: POST /auth/login
          const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password
          })

          const { success, data } = response.data

          if (success && data?.access_token) {
            // O objeto retornado aqui será salvo no JWT
            return {
              id: data.user.id,
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
    })
  ],
  callbacks: {
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
