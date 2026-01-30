import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { useMemo, useEffect } from "react"

export type Service = {
  id: string
  name: string
  price: number
  duration: number
  description?: string
}

export function useServices() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      try {
        const res = await api.get("/services")
        console.log('useServices API Raw Response:', res.data)
        return res.data
      } catch (error) {
        console.error("Erro ao buscar serviços:", error)
        throw error
      }
    }
  })

  // Extrair services com segurança máxima
  const services = useMemo(() => {
    const data = query.data
    if (!data) return []
    if (Array.isArray(data)) return data
    if (Array.isArray(data.data)) return data.data
    return []
  }, [query.data])

  useEffect(() => {
    if (query.data) {
      console.log('useServices - Final array:', services)
    }
  }, [query.data, services])

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
    services,
    isLoading: query.isLoading,
    isError: query.isError,
    createService: createMutation,
    deleteService: deleteMutation,
    updateService: updateMutation
  }
}
