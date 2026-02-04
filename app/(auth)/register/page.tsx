"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, RegisterInput } from "@/lib/validations"
import { signIn } from "next-auth/react"
import { useState, Suspense } from "react"
import { toast } from "sonner"
import { Eye, EyeOff, Lock, Mail, ArrowRight, User, Building2, Phone, Check } from "lucide-react"
import { api, getUploadUrl } from "@/lib/api"
import { usePlatformBranding } from "@/hooks/usePlatformBranding"
import { adjustBrightness } from "@/lib/colors"
import { useTranslations } from "next-intl"
import { LanguageSelector } from "@/components/language-selector"

function maskDocument(value: string) {
  const digits = value.replace(/\D/g, "")
  if (digits.length <= 11) {
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2")
      .slice(0, 14)
  }
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18)
}

function maskPhone(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15)
}

function RegisterContent() {
  const { branding } = usePlatformBranding()
  const t = useTranslations("auth")
  const tc = useTranslations("common")
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  const clinicParam = branding.clinicSlug ? `?clinic=${branding.clinicSlug}` : ""

  const onSubmit = async (data: RegisterInput) => {
    setApiError(null)
    try {
      const cleanData = {
        name: data.name,
        email: data.email,
        password: data.password,
        clinic_name: data.clinic_name,
        cnpj: data.cnpj.replace(/\D/g, ""),
        phone: data.phone.replace(/\D/g, "")
      }

      await api.post("/auth/register", cleanData)

      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false
      })

      if (res?.ok) {
        toast.success(t("registerSuccess"))
        setTimeout(() => {
          window.location.href = "/home"
        }, 300)
      } else {
        toast.success(t("registerSuccessLogin"))
        window.location.href = "/login"
      }
    } catch (error: any) {
      const status = error?.response?.status
      const msg = error?.response?.data?.message || ""

      if (status === 409) {
        if (msg.includes("Email")) {
          setApiError(t("emailAlreadyRegistered"))
        } else if (msg.includes("CNPJ")) {
          setApiError(t("cnpjAlreadyRegistered"))
        } else {
          setApiError(t("emailOrCnpjRegistered"))
        }
      } else {
        setApiError(t("registerError"))
      }
      toast.error(t("registerFailed"))
    }
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
            {t("registerHeroTitle")}
          </h1>
          <p className="text-xl text-white/90 max-w-lg">
            {t("registerHeroSubtitle")}
          </p>

          <div className="space-y-3 pt-2">
            {[
              t("registerFeature1"),
              t("registerFeature2"),
              t("registerFeature3"),
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

      {/* Lado Direito */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background text-foreground">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center lg:text-left animate-fade-in-up">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">{t("registerFormTitle")}</h2>
            <p className="text-muted-foreground">
              {t("registerFormSubtitle")}
            </p>
          </div>

          <Card className="border-none shadow-none lg:shadow-md lg:border lg:bg-card animate-fade-in-up opacity-0" style={{ animationDelay: "100ms" }}>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Nome */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("yourName")}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("namePlaceholder")}
                      className="pl-10 h-11 bg-white dark:bg-gray-900 text-foreground"
                      {...register("name")}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("professionalEmail")}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("emailPlaceholder")}
                      className="pl-10 h-11 bg-white dark:bg-gray-900 text-foreground"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                {/* Senha + Confirmar */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">{t("password")}</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10 h-11 bg-white dark:bg-gray-900 text-foreground"
                        placeholder={t("passwordPlaceholder")}
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
                    <label className="text-sm font-medium text-foreground">{t("confirmPasswordShort")}</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="pl-10 h-11 bg-white dark:bg-gray-900 text-foreground"
                        placeholder={t("repeatPassword")}
                        {...register("confirmPassword")}
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground lg:bg-card">{t("clinicDataSection")}</span>
                  </div>
                </div>

                {/* Nome da Clínica */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("clinicName")}</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("clinicNamePlaceholder")}
                      className="pl-10 h-11 bg-white dark:bg-gray-900 text-foreground"
                      {...register("clinic_name")}
                    />
                  </div>
                  {errors.clinic_name && <p className="text-xs text-destructive">{errors.clinic_name.message}</p>}
                </div>

                {/* CPF/CNPJ + Telefone */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">{t("cpfOrCnpj")}</label>
                    <Input
                      placeholder={t("cpfPlaceholder")}
                      className="h-11 bg-white dark:bg-gray-900 text-foreground"
                      {...register("cnpj")}
                      onChange={(e) => setValue("cnpj", maskDocument(e.target.value))}
                    />
                    {errors.cnpj && <p className="text-xs text-destructive">{errors.cnpj.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">{tc("phone")}</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t("phonePlaceholder")}
                        className="pl-10 h-11 bg-white dark:bg-gray-900 text-foreground"
                        {...register("phone")}
                        onChange={(e) => setValue("phone", maskPhone(e.target.value))}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                  </div>
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
                  {isSubmitting ? t("creatingAccount") : t("startFreeTrial")}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground animate-fade-in opacity-0" style={{ animationDelay: "200ms" }}>
            {t("hasAccount")}{" "}
            <Link href={`/login${clinicParam}`} className="font-semibold text-primary hover:underline">
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
      <RegisterContent />
    </Suspense>
  )
}
