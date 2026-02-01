import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { useMemo } from "react"

export type Patient = {
  id: string
  name: string
  phone: string
  cpf?: string
  email?: string
  birth_date?: string
  address?: string
  status: "Ativo" | "Inativo"
}

export function usePatients(search?: string, status?: string, page = 1, limit = 10) {
  const queryClient = useQueryClient()

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
        return res.data
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error)
        throw error
      }
    }
  })

  // Extrair patients: desempacotar TransformInterceptor + paginação
  // API retorna: { success, data: { data: [...], meta: {...} }, timestamp }
  const patients = useMemo(() => {
    const data = query.data
    if (!data) return []
    if (Array.isArray(data)) return data
    // TransformInterceptor: data.data = { data: [...], meta }
    const payload = data.data
    if (Array.isArray(payload)) return payload
    if (payload && Array.isArray(payload.data)) return payload.data
    return []
  }, [query.data])

  const meta = query.data?.data?.meta || query.data?.meta || { total: 0, pages: 0 }

  const createMutation = useMutation({
    mutationFn: async (payload: Omit<Patient, "id">) => {
      const res = await api.post("/patients", payload)
      return res.data?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      toast.success("Paciente criado com sucesso")
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao criar paciente")
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Patient> & { id: string }) => {
      const res = await api.put(`/patients/${id}`, payload)
      return res.data?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      toast.success("Paciente atualizado com sucesso")
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao atualizar paciente")
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/patients/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao remover paciente")
    }
  })

  return {
    patients,
    meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createPatient: createMutation,
    updatePatient: updateMutation,
    deletePatient: deleteMutation
  }
}
