"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { ShieldCheck, Loader2, ArrowLeft } from "lucide-react"
import { api, getUploadUrl } from "@/lib/api"
import Link from "next/link"
import { usePlatformBranding } from "@/hooks/usePlatformBranding"
import { adjustBrightness } from "@/lib/colors"
import { useTranslations } from "next-intl"
import { LanguageSelector } from "@/components/language-selector"

function Verify2faContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { branding } = usePlatformBranding()
  const t = useTranslations("auth")
  const [twoFactorToken, setTwoFactorToken] = useState<string | null>(null)
  const [method, setMethod] = useState("whatsapp")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [ready, setReady] = useState(false)

  // Read token from sessionStorage (preferred) or URL params (fallback from server-side redirect)
  // If found in URL, move to sessionStorage and clean the URL to avoid exposure in browser history
  useEffect(() => {
    const urlToken = searchParams.get("token")
    const urlMethod = searchParams.get("method")

    if (urlToken) {
      sessionStorage.setItem("2fa_token", urlToken)
      if (urlMethod) sessionStorage.setItem("2fa_method", urlMethod)
      setTwoFactorToken(urlToken)
      setMethod(urlMethod || "whatsapp")
      window.history.replaceState({}, "", "/login/verify-2fa")
    } else {
      const storedToken = sessionStorage.getItem("2fa_token")
      const storedMethod = sessionStorage.getItem("2fa_method")
      setTwoFactorToken(storedToken)
      setMethod(storedMethod || "whatsapp")
    }
    setReady(true)
  }, [searchParams])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleVerify = async () => {
    if (!twoFactorToken || code.length < 6) return
    setLoading(true)
    try {
      const res = await api.post("/auth/verify-2fa", {
        two_factor_token: twoFactorToken,
        code,
        method
      })

      const data = res.data?.data || res.data

      if (data?.access_token) {
        // Complete login via signIn with the tokens
        const signInRes = await signIn("credentials", {
          email: "__2fa__",
          password: `__token__:${data.access_token}`,
          redirect: false
        })

        if (signInRes?.ok) {
          sessionStorage.removeItem("2fa_token")
          sessionStorage.removeItem("2fa_method")
          toast.success(t("loginSuccess"))
          window.location.href = "/home"
        } else {
          toast.error(t("completeLoginError"))
        }
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || t("invalidCode")
      toast.error(msg)
      setCode("")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!twoFactorToken || resending) return
    setResending(true)
    try {
      const res = await api.post("/auth/2fa/send-code", {
        two_factor_token: twoFactorToken
      })
      const data = res.data?.data || res.data
      if (data?.delivery_method === "email" && method === "whatsapp") {
        toast.success(t("whatsappUnavailableResend"))
      } else {
        toast.success(t("codeResent"))
      }
      setCountdown(60)
    } catch {
      toast.error(t("resendError"))
    } finally {
      setResending(false)
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!twoFactorToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">{t("invalidSession")}</h2>
          <p className="text-muted-foreground">{t("loginAgain")}</p>
          <Link href="/login">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("backToLogin")}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const heroDescription = method === "totp"
    ? t("twoFaHeroTotp")
    : method === "email"
    ? t("twoFaHeroEmail")
    : t("twoFaHeroWhatsapp")

  const formDescription = method === "totp"
    ? t("twoFaDescTotp")
    : method === "email"
    ? t("twoFaDescEmail")
    : t("twoFaDescWhatsapp")

  return (
    <div className="flex min-h-screen">
      {/* Lado Esquerdo */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white relative overflow-hidden"
        style={{ backgroundColor: branding.primaryColor }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(-45deg, ${adjustBrightness(branding.primaryColor, -15)}, ${branding.primaryColor}, ${adjustBrightness(branding.primaryColor, 10)}, ${adjustBrightness(branding.primaryColor, -25)})`,
            backgroundSize: "400% 400%",
            animation: "gradient-shift 8s ease infinite",
          }}
        />
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
          {branding.logoUrl ? (
            <img src={getUploadUrl(branding.logoUrl)} alt={branding.name} className="h-8 w-8 rounded-lg object-contain bg-white p-0.5" />
          ) : (
            <div className="bg-white p-1 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill={branding.primaryColor}/>
              </svg>
            </div>
          )}
          {branding.name}
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-bold leading-tight text-white">
            {t("twoFaHeroTitle")}
          </h1>
          <p className="text-xl text-white/90 max-w-lg">
            {heroDescription}
          </p>
        </div>

        <div className="relative z-10 text-sm text-white/70">
          {t("copyright", { year: new Date().getFullYear(), name: branding.name })}
        </div>
      </div>

      {/* Lado Direito */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background text-foreground">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">{t("twoFaFormTitle")}</h2>
              <p className="text-muted-foreground">
                {formDescription}
              </p>
            </div>
          </div>

          <Card className="border-none shadow-none lg:shadow-md lg:border lg:bg-card">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("verificationCode")}</label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    className="h-14 text-center text-2xl font-mono tracking-[0.5em] bg-white dark:bg-gray-900 text-foreground"
                    maxLength={6}
                    autoFocus
                    onKeyDown={(e) => { if (e.key === "Enter") handleVerify() }}
                  />
                </div>

                <Button
                  className="w-full h-12 text-base font-semibold"
                  disabled={loading || code.length < 6}
                  onClick={handleVerify}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("verifying")}
                    </>
                  ) : (
                    t("verifyAndLogin")
                  )}
                </Button>

                {method !== "totp" && (
                  <div className="text-center">
                    <button
                      onClick={handleResend}
                      disabled={resending || countdown > 0}
                      className="text-sm text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
                    >
                      {countdown > 0
                        ? t("resendIn", { seconds: countdown })
                        : resending
                        ? t("resending")
                        : t("resendCode")}
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="font-semibold text-primary hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              {t("backToLogin")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Verify2faPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <Verify2faContent />
    </Suspense>
  )
}
