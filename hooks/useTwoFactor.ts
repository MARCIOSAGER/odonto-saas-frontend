"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { toast } from "sonner"

export function useTwoFactorStatus() {
  return useQuery({
    queryKey: ["2fa-status"],
    queryFn: async () => {
      const res = await api.get("/auth/2fa/status")
      return res.data?.data || res.data
    },
  })
}

export function useSetupWhatsApp2fa() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (phone: string) => {
      const res = await api.post("/auth/2fa/setup/whatsapp", { phone })
      return res.data?.data || res.data
    },
    onSuccess: () => {
      toast.success("2FA WhatsApp ativado com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["2fa-status"] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Erro ao ativar 2FA WhatsApp")
    },
  })
}

export function useSetupTotp() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/2fa/setup/totp")
      return res.data?.data || res.data
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Erro ao gerar QR code")
    },
  })
}

export function useVerifyTotpSetup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ code, secret }: { code: string; secret: string }) => {
      const res = await api.post("/auth/2fa/setup/totp/verify", { code, secret })
      return res.data?.data || res.data
    },
    onSuccess: () => {
      toast.success("2FA TOTP ativado com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["2fa-status"] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Código TOTP inválido")
    },
  })
}

export function useDisable2fa() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (password: string) => {
      const res = await api.post("/auth/2fa/disable", { password })
      return res.data?.data || res.data
    },
    onSuccess: () => {
      toast.success("2FA desativado com sucesso")
      queryClient.invalidateQueries({ queryKey: ["2fa-status"] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Erro ao desativar 2FA")
    },
  })
}
