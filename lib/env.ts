/**
 * Typed environment variables.
 *
 * Public variables (NEXT_PUBLIC_*) are available on both client and server.
 * Server-only variables are only accessible in server components, API routes, and middleware.
 */

// ── Public (client + server) ──────────────────────────────────────────
export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://odontosaas.com.br",
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
  sentryEnvironment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || "development",
} as const

// ── Server-only ───────────────────────────────────────────────────────
export const serverEnv = {
  nextAuthSecret: process.env.NEXTAUTH_SECRET || "",
  nextAuthUrl: process.env.NEXTAUTH_URL || "",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  sentryAuthToken: process.env.SENTRY_AUTH_TOKEN || "",
} as const
