import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/toast"

export type Appointment = {
  id: string
  date_time: string
  patient_id: string
  dentist_id: string
  service_id: string
  patient_name?: string
  dentist_name?: string
  service_name?: string
  notes?: string
  status: "Confirmado" | "Pendente" | "Cancelado"
}

export function useAppointments(filters?: { date?: string; range?: number; status?: string; page?: number; limit?: number }) {
  const queryClient = useQueryClient()
  const { success, error: toastError } = useToast()

  const query = useQuery({
    queryKey: ["appointments", filters],
    queryFn: async () => {
      try {
        const res = await api.get("/appointments", { 
          params: {
            ...filters,
            page: filters?.page || 1,
            limit: filters?.limit || 10
          }
        })
        const data = res.data?.data
        return {
          data: Array.isArray(data) ? data : [],
          meta: res.data?.meta || { total: 0, pages: 0 }
        }
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error)
        return {
          data: [],
          meta: { total: 0, pages: 0 }
        }
      }
    }
  })

  const createMutation = useMutation({
    mutationFn: async (payload: Omit<Appointment, "id">) => {
      const res = await api.post("/appointments", payload)
      return res.data?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      success("Agendamento criado com sucesso")
    },
    onError: (err: any) => {
      toastError(err.response?.data?.message || "Erro ao criar agendamento")
    }
  })

  const confirmMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/appointments/${id}/confirm`)
      return res.data?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      success("Agendamento confirmado")
    },
    onError: (err: any) => {
      toastError(err.response?.data?.message || "Erro ao confirmar agendamento")
    }
  })

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/appointments/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      success("Agendamento cancelado")
    },
    onError: (err: any) => {
      toastError(err.response?.data?.message || "Erro ao cancelar agendamento")
    }
  })

  return {
    appointments: query.data?.data || [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    createAppointment: createMutation,
    confirmAppointment: confirmMutation,
    cancelAppointment: cancelMutation
  }
}
