"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resetPasswordSchema, ResetPasswordInput } from "@/lib/validations"
import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { useTranslations } from "next-intl"
import { LanguageSelector } from "@/components/layout/language-selector"
import { usePlatformBranding } from "@/hooks/usePlatformBranding"
import { adjustBrightness } from "@/lib/colors"

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { branding } = usePlatformBranding()
  const t = useTranslations("auth")
  const token = searchParams.get("token")
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) })

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      toast.error(t("tokenNotFound"))
      return
    }
    try {
      await api.post("/auth/reset-password", {
        token,
        password: data.password
      })
      setSuccess(true)
      toast.success(t("resetSuccess"))
    } catch (error: any) {
      const msg = error?.response?.data?.message || t("tokenInvalid")
      toast.error(msg)
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">{t("invalidLink")}</h2>
          <p className="text-muted-foreground">{t("invalidLinkMessage")}</p>
          <Link href="/forgot-password">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("requestNewLink")}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">{t("passwordResetTitle")}</h2>
            <p className="text-muted-foreground">{t("passwordResetMessage")}</p>
          </div>
          <Button onClick={() => router.push("/login")} className="gap-2">
            {t("goToLogin")}
          </Button>
        </div>
      </div>
    )
  }

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
            <img src={branding.logoUrl} alt={branding.name} className="h-8 w-8 rounded-lg object-contain bg-white p-0.5" />
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
            {t("resetHeroTitle")}
          </h1>
          <p className="text-xl text-white/90 max-w-lg">
            {t("resetHeroSubtitle")}
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
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">{t("resetPassword")}</h2>
            <p className="text-muted-foreground">
              {t("resetFormSubtitle")}
            </p>
          </div>

          <Card className="border-none shadow-none lg:shadow-md lg:border lg:bg-card">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("newPassword")}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10 h-12 bg-white dark:bg-gray-900 text-foreground"
                      placeholder={t("minChars")}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("confirmNewPassword")}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="pl-10 h-12 bg-white dark:bg-gray-900 text-foreground"
                      placeholder={t("repeatNewPassword")}
                      {...register("confirmPassword")}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("savingPassword") : t("saveNewPassword")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
