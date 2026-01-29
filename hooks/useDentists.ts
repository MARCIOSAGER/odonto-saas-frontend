import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { toast } from "sonner"

export type Dentist = {
  id: string
  name: string
  cro: string
  specialty: string
  phone?: string
  email?: string
}

export function useDentists() {
  const queryClient = useQueryClient()

  const query = useQuery<Dentist[]>({
    queryKey: ["dentists"],
    queryFn: async () => {
      try {
        const res = await api.get("/dentists")
        const data = res.data?.data
        return Array.isArray(data) ? data : []
      } catch (error) {
        console.error("Erro ao buscar dentistas:", error)
        return []
      }
    }
  })

  const createMutation = useMutation({
    mutationFn: async (payload: Omit<Dentist, "id">) => {
      const res = await api.post("/dentists", payload)
      return res.data?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentists"] })
      toast.success("Dentista criado com sucesso")
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao criar dentista")
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/dentists/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentists"] })
      toast.success("Dentista removido com sucesso")
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao remover dentista")
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Dentist> & { id: string }) => {
      const res = await api.put(`/dentists/${id}`, payload)
      return res.data?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentists"] })
      toast.success("Dentista atualizado com sucesso")
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao atualizar dentista")
    }
  })

  return {
    dentists: query.data || [],
    isLoading: query.isLoading,
    createDentist: createMutation,
    deleteDentist: deleteMutation,
    updateDentist: updateMutation
  }
}
