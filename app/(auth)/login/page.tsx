"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginInput } from "@/lib/validations"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { toast } from "sonner"
import { Eye, EyeOff, Lock, Mail, ArrowRight, Check } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { api, getUploadUrl } from "@/lib/api"
import { Suspense } from "react"
import { usePlatformBranding } from "@/hooks/usePlatformBranding"
import { adjustBrightness } from "@/lib/colors"
import { useTranslations } from "next-intl"
import { LanguageSelector } from "@/components/layout/language-selector"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { branding } = usePlatformBranding()
  const t = useTranslations("auth")
  const [showPassword, setShowPassword] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })
  const urlError = searchParams.get("error")
  const [apiError, setApiError] = useState<string | null>(urlError)

  const clinicParam = branding.clinicSlug ? `?clinic=${branding.clinicSlug}` : ""

  const onSubmit = async (data: LoginInput) => {
    setApiError(null)
    try {
      // Call backend directly to check for 2FA
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password
      })
      const result = response.data?.data || response.data

      // Check if 2FA is required
      if (result?.requires_2fa) {
        if (result?.code_sent === false) {
          setApiError(t("twoFaError"))
          toast.error(t("twoFaError"))
          return
        }
        const deliveryMethod = result.code_delivery_method || result.two_factor_method || "whatsapp"
        // Store 2FA token in sessionStorage instead of URL to avoid exposure in browser history/logs
        sessionStorage.setItem("2fa_token", result.two_factor_token)
        sessionStorage.setItem("2fa_method", deliveryMethod)
        if (deliveryMethod === "email" && result.two_factor_method === "whatsapp") {
          toast.info(t("twoFaFallback"))
        }
        router.push("/login/verify-2fa")
        return
      }

      // No 2FA - complete login via NextAuth
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false
      })
      if (res?.ok) {
        toast.success(t("loginSuccess"))
        // Use router.replace for cleaner navigation after auth
        router.replace("/home")
      } else {
        setApiError(t("invalidCredentials"))
        toast.error(t("authFailed"))
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || t("invalidCredentials")
      setApiError(msg)
      toast.error(t("authFailed"))
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    await signIn("google", { callbackUrl: "/home" })
  }

  return (
    <div className="flex min-h-screen">
      {/* Lado Esquerdo - Visual Branding */}
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

        {/* Decorativo */}
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
            {t("heroTitle")}
          </h1>
          <p className="text-xl text-white/90 max-w-lg">
            {t("heroSubtitle")}
          </p>

          <div className="space-y-3 pt-2">
            {[
              t("feature1"),
              t("feature2"),
              t("feature3"),
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm text-white/90">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex -space-x-2">
              {[
                { initials: "RC", bg: "bg-emerald-500" },
                { initials: "AM", bg: "bg-violet-500" },
                { initials: "LS", bg: "bg-amber-500" },
                { initials: "JP", bg: "bg-rose-500" },
              ].map((avatar) => (
                <div
                  key={avatar.initials}
                  className={`w-9 h-9 rounded-full border-2 border-white/30 ${avatar.bg} flex items-center justify-center text-[11px] font-bold text-white`}
                >
                  {avatar.initials}
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-white/90">
              {t("socialProof")}
            </p>
          </div>
        </div>

        <div className="relative z-10 text-sm text-white/70">
          {t("copyright", { year: new Date().getFullYear(), name: branding.name })}
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background text-foreground">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left animate-fade-in-up">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">{t("loginTitle")}</h2>
            <p className="text-muted-foreground">
              {t("loginSubtitle")}
            </p>
          </div>

          <Card className="border-none shadow-none lg:shadow-md lg:border lg:bg-card animate-fade-in-up opacity-0" style={{ animationDelay: "100ms" }}>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                    {t("professionalEmail")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("emailPlaceholder")}
                      className="pl-10 h-12 bg-white dark:bg-gray-900 text-foreground"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium leading-none text-foreground">{t("password")}</label>
                    <Link href={`/forgot-password${clinicParam}`} className="text-xs text-primary hover:underline font-medium">
                      {t("forgotPassword")}
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10 h-12 bg-white dark:bg-gray-900 text-foreground"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>

                {apiError && (
                  <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
                    {apiError}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("authenticating") : t("signIn")}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground lg:bg-card">{t("orContinueWith")}</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium gap-3"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {googleLoading ? t("connecting") : t("signInGoogle")}
              </Button>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground animate-fade-in opacity-0" style={{ animationDelay: "200ms" }}>
            {t("noAccount")}{" "}
            <Link href={`/register${clinicParam}`} className="font-semibold text-primary hover:underline">
              {t("startFreeTrial")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
      <LoginContent />
    </Suspense>
  )
}
