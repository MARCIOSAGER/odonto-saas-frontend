import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { toast } from "sonner"

export type Service = {
  id: string
  name: string
  price: number
  duration: number
  description?: string
}

export function useServices() {
  const queryClient = useQueryClient()

  const query = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      try {
        const res = await api.get("/services")
        const data = res.data?.data
        return Array.isArray(data) ? data : []
      } catch (error) {
        console.error("Erro ao buscar serviços:", error)
        return []
      }
    }
  })

  const createMutation = useMutation({
    mutationFn: async (payload: Omit<Service, "id">) => {
      const res = await api.post("/services", payload)
      return res.data?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
      toast.success("Serviço criado com sucesso")
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao criar serviço")
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/services/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
      toast.success("Serviço removido com sucesso")
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao remover serviço")
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Service> & { id: string }) => {
      const res = await api.put(`/services/${id}`, payload)
      return res.data?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
      toast.success("Serviço atualizado com sucesso")
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao atualizar serviço")
    }
  })

  return {
    services: Array.isArray(query.data) ? query.data : ((query.data as any)?.data || []),
    isLoading: query.isLoading,
    createService: createMutation,
    deleteService: deleteMutation,
    updateService: updateMutation
  }
}
