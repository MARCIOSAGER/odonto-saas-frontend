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
        toast.success("Conta criada com sucesso!")
        setTimeout(() => {
          window.location.href = "/home"
        }, 300)
      } else {
        toast.success("Conta criada! Faça login para continuar.")
        window.location.href = "/login"
      }
    } catch (error: any) {
      const status = error?.response?.status
      const msg = error?.response?.data?.message || ""

      if (status === 409) {
        if (msg.includes("Email")) {
          setApiError("Este e-mail já está cadastrado.")
        } else if (msg.includes("CNPJ")) {
          setApiError("Este CPF/CNPJ já está cadastrado.")
        } else {
          setApiError("E-mail ou CPF/CNPJ já cadastrado.")
        }
      } else {
        setApiError("Erro ao criar conta. Tente novamente.")
      }
      toast.error("Falha no registro")
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
            Comece agora, grátis.
          </h1>
          <p className="text-xl text-white/90 max-w-lg">
            Crie sua conta e comece a gerenciar seu consultório em poucos minutos. Sem cartão de crédito.
          </p>

          <div className="space-y-3 pt-2">
            {[
              "Teste grátis completo, sem compromisso",
              "Configuração em menos de 5 minutos",
              "Atendimento via WhatsApp com IA incluso",
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
              +2.000 profissionais já usam
            </p>
          </div>
        </div>

        <div className="relative z-10 text-sm text-white/70">
          © {new Date().getFullYear()} {branding.name}. Todos os direitos reservados.
        </div>
      </div>

      {/* Lado Direito */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background text-foreground">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center lg:text-left animate-fade-in-up">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Criar conta</h2>
            <p className="text-muted-foreground">
              Preencha os dados abaixo para começar seu teste grátis.
            </p>
          </div>

          <Card className="border-none shadow-none lg:shadow-md lg:border lg:bg-card animate-fade-in-up opacity-0" style={{ animationDelay: "100ms" }}>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Nome */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Seu nome</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="João Silva"
                      className="pl-10 h-11 bg-white dark:bg-gray-900 text-foreground"
                      {...register("name")}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">E-mail profissional</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="nome@clinica.com"
                      className="pl-10 h-11 bg-white dark:bg-gray-900 text-foreground"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                {/* Senha + Confirmar */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10 h-11 bg-white dark:bg-gray-900 text-foreground"
                        placeholder="Min. 8 chars"
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
                    <label className="text-sm font-medium text-foreground">Confirmar</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="pl-10 h-11 bg-white dark:bg-gray-900 text-foreground"
                        placeholder="Repita"
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
                    <span className="bg-background px-2 text-muted-foreground lg:bg-card">Dados da clínica</span>
                  </div>
                </div>

                {/* Nome da Clínica */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nome da clínica</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Clínica Odonto Saúde"
                      className="pl-10 h-11 bg-white dark:bg-gray-900 text-foreground"
                      {...register("clinic_name")}
                    />
                  </div>
                  {errors.clinic_name && <p className="text-xs text-destructive">{errors.clinic_name.message}</p>}
                </div>

                {/* CPF/CNPJ + Telefone */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">CPF ou CNPJ</label>
                    <Input
                      placeholder="000.000.000-00"
                      className="h-11 bg-white dark:bg-gray-900 text-foreground"
                      {...register("cnpj")}
                      onChange={(e) => setValue("cnpj", maskDocument(e.target.value))}
                    />
                    {errors.cnpj && <p className="text-xs text-destructive">{errors.cnpj.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Telefone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="(00) 00000-0000"
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
                  {isSubmitting ? "Criando conta..." : "Começar teste grátis"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground animate-fade-in opacity-0" style={{ animationDelay: "200ms" }}>
            Já tem uma conta?{" "}
            <Link href={`/login${clinicParam}`} className="font-semibold text-primary hover:underline">
              Fazer login
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
