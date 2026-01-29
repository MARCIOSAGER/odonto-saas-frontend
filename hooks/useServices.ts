import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/toast"

export type Service = {
  id: string
  nome: string
  preco: number
  duracao: number
}

export function useServices() {
  const queryClient = useQueryClient()
  const { success, error: toastError } = useToast()

  const query = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await api.get("/services")
      return res.data?.data || []
    }
  })

  const createMutation = useMutation({
    mutationFn: async (payload: Omit<Service, "id">) => {
      const res = await api.post("/services", payload)
      return res.data?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
      success("Serviço criado com sucesso")
    },
    onError: (err: any) => {
      toastError(err.response?.data?.message || "Erro ao criar serviço")
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/services/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
      success("Serviço removido com sucesso")
    },
    onError: (err: any) => {
      toastError(err.response?.data?.message || "Erro ao remover serviço")
    }
  })

  return {
    services: query.data || [],
    isLoading: query.isLoading,
    createService: createMutation,
    deleteService: deleteMutation
  }
}
