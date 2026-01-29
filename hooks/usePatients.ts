import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/toast"

export type Patient = {
  id: string
  nome: string
  telefone: string
  cpf?: string
  email?: string
  status: "Ativo" | "Inativo"
}

export function usePatients(search?: string, status?: string, page = 1, limit = 10) {
  const queryClient = useQueryClient()
  const { success, error: toastError } = useToast()

  const query = useQuery({
    queryKey: ["patients", search, status, page, limit],
    queryFn: async () => {
      try {
        const res = await api.get("/patients", {
          params: { 
            q: search, 
            status: status === "Todos" ? undefined : status,
            page,
            limit
          }
        })
        const data = res.data?.data
        return {
          data: Array.isArray(data) ? data : [],
          meta: res.data?.meta || { total: 0, pages: 0 }
        }
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error)
        return {
          data: [],
          meta: { total: 0, pages: 0 }
        }
      }
    }
  })

  const createMutation = useMutation({
    mutationFn: async (payload: Omit<Patient, "id">) => {
      const res = await api.post("/patients", payload)
      return res.data?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      success("Paciente criado com sucesso")
    },
    onError: (err: any) => {
      toastError(err.response?.data?.message || "Erro ao criar paciente")
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Patient> & { id: string }) => {
      const res = await api.put(`/patients/${id}`, payload)
      return res.data?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      success("Paciente atualizado com sucesso")
    },
    onError: (err: any) => {
      toastError(err.response?.data?.message || "Erro ao atualizar paciente")
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/patients/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      success("Paciente removido com sucesso")
    },
    onError: (err: any) => {
      toastError(err.response?.data?.message || "Erro ao remover paciente")
    }
  })

  return {
    patients: query.data?.data || [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createPatient: createMutation,
    updatePatient: updateMutation,
    deletePatient: deleteMutation
  }
}
