import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/toast"

export type Appointment = {
  id: string
  data: string
  hora: string
  paciente_id: string
  dentista_id: string
  servico_id: string
  paciente?: string
  dentista?: string
  servico?: string
  status: "Confirmado" | "Pendente" | "Cancelado"
}

export function useAppointments(filters?: { date?: string; range?: number; status?: string }) {
  const queryClient = useQueryClient()
  const { success, error: toastError } = useToast()

  const query = useQuery<Appointment[]>({
    queryKey: ["appointments", filters],
    queryFn: async () => {
      const res = await api.get("/appointments", { params: filters })
      return res.data?.data || []
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
    appointments: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    createAppointment: createMutation,
    confirmAppointment: confirmMutation,
    cancelAppointment: cancelMutation
  }
}
