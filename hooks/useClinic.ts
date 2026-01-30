import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query" 
import { api } from "@/lib/api" 
import { toast } from "sonner" 

export function useClinic() { 
  const queryClient = useQueryClient() 

  const query = useQuery({ 
    queryKey: ["clinic", "my-profile"], 
    queryFn: async () => { 
      try {
        const res = await api.get("/clinics/my/profile") 
        return res.data?.data || {} 
      } catch (error) {
        console.error("Erro ao buscar perfil da clínica:", error)
        return {}
      }
    } 
  }) 

  const updateClinicMutation = useMutation({ 
    mutationFn: async (payload: any) => { 
      const res = await api.put("/clinics/my/profile", payload) 
      return res.data?.data || {} 
    }, 
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["clinic"] }) 
      toast.success("Clínica atualizada com sucesso") 
    }, 
    onError: (err: any) => { 
      toast.error(err.response?.data?.message || "Erro ao atualizar") 
    } 
  }) 

  const aiSettingsQuery = useQuery({ 
    queryKey: ["clinic", "ai-settings"], 
    queryFn: async () => { 
      try {
        const res = await api.get("/clinics/my/ai-settings") 
        return res.data?.data || {} 
      } catch (error) {
        console.error("Erro ao buscar configurações de IA:", error)
        return {}
      }
    } 
  }) 

  const updateAISettingsMutation = useMutation({ 
    mutationFn: async (payload: any) => { 
      const res = await api.put("/clinics/my/ai-settings", payload) 
      return res.data?.data || {} 
    }, 
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["clinic", "ai-settings"] }) 
      toast.success("Configurações de IA atualizadas") 
    }, 
    onError: (err: any) => { 
      toast.error(err.response?.data?.message || "Erro ao atualizar") 
    } 
  }) 

  const testWhatsAppMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/clinics/my/test-whatsapp")
      return res.data?.data || res.data
    },
    onSuccess: (data) => {
      if (data?.connected) {
        toast.success(data?.message || "WhatsApp conectado com sucesso!")
      } else {
        toast.error(data?.message || "WhatsApp desconectado")
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao testar conexão")
    }
  })

  const getQrCodeMutation = useMutation({
    mutationFn: async () => {
      const res = await api.get("/clinics/my/whatsapp-qrcode")
      return res.data?.data || res.data
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao gerar QR Code")
    }
  })

  const sendTestMessageMutation = useMutation({
    mutationFn: async (phone: string) => {
      const res = await api.post("/clinics/my/send-test-whatsapp", { phone })
      return res.data?.data || res.data
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data?.message || "Mensagem de teste enviada!")
      } else {
        toast.error(data?.message || "Erro ao enviar mensagem de teste")
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao enviar mensagem de teste")
    }
  })

  return {
    clinic: query.data,
    isLoading: query.isLoading,
    updateClinic: updateClinicMutation,
    aiSettings: aiSettingsQuery.data,
    isLoadingAI: aiSettingsQuery.isLoading,
    updateAISettings: updateAISettingsMutation,
    testWhatsApp: testWhatsAppMutation,
    getQrCode: getQrCodeMutation,
    sendTestMessage: sendTestMessageMutation
  }
} 
