"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginInput } from "@/lib/validations"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useToast } from "@/components/ui/toast"
import { useGlobalStore } from "@/lib/store"
import { Hospital } from "lucide-react"

export default function LoginPage() {
  const { success, error } = useToast()
  const setToken = useGlobalStore((s) => s.setToken)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })
  const [apiError, setApiError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data: LoginInput) => {
    setApiError(null)
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false
    })
    if (res?.ok) {
      success("Login realizado com sucesso")
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 300)
    } else {
      setApiError("Email ou senha inválidos")
      error("Falha na autenticação")
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 p-10">
        <div className="max-w-md">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/70 p-3 shadow-sm">
              <Hospital className="text-primary" size={28} />
            </div>
            <div className="text-3xl font-bold text-primary">Odonto SaaS</div>
          </div>
          <p className="mt-4 text-gray-700">
            Plataforma moderna para gestão de clínicas odontológicas. Agendamentos, pacientes e serviços em um só lugar.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-gray-50 p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="text-center">
              <div className="text-2xl font-semibold text-primary">Bem-vindo de volta</div>
              <div className="mt-1 text-sm text-gray-600">Entre com suas credenciais para continuar.</div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-label="Formulário de login">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
                <Input id="email" type="email" placeholder="seu@email.com" aria-invalid={!!errors.email} {...register("email")} />
                {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium">Senha</label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-primary"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  Lembrar-me
                </label>
                <Link href="#" className="text-primary">Esqueceu a senha?</Link>
              </div>
              {apiError && <p className="text-sm text-error">{apiError}</p>}
              <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="w-full">
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Não tem conta? <Link href="/register" className="text-primary">Criar conta</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
