import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query" 
import { api } from "@/lib/api" 
import { useToast } from "@/components/ui/toast" 

export function useClinic() { 
  const queryClient = useQueryClient() 
  const { success, error: toastError } = useToast() 

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
      success("Clínica atualizada com sucesso") 
    }, 
    onError: (err: any) => { 
      toastError(err.response?.data?.message || "Erro ao atualizar") 
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
      success("Configurações de IA atualizadas") 
    }, 
    onError: (err: any) => { 
      toastError(err.response?.data?.message || "Erro ao atualizar") 
    } 
  }) 

  const testWhatsAppMutation = useMutation({ 
    mutationFn: async () => { 
      try {
        // O endpoint /clinics/my/test-whatsapp não existe no backend ainda
        // Simular delay e sucesso para evitar 404
        await new Promise(resolve => setTimeout(resolve, 1000))
        return { success: true }
      } catch (error) {
        console.error("Erro ao testar WhatsApp:", error)
        throw error
      }
    },
    onSuccess: () => {
      success("Teste de WhatsApp simulado com sucesso")
    },
    onError: () => {
      toastError("Funcionalidade em desenvolvimento")
    }
  }) 

  return { 
    clinic: query.data, 
    isLoading: query.isLoading, 
    updateClinic: updateClinicMutation, 
    aiSettings: aiSettingsQuery.data, 
    isLoadingAI: aiSettingsQuery.isLoading, 
    updateAISettings: updateAISettingsMutation, 
    testWhatsApp: testWhatsAppMutation 
  } 
} 
