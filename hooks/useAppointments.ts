import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { useMemo, useEffect } from "react"

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
        console.log('useAppointments API Raw Response:', res.data)
        return res.data
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error)
        throw error
      }
    }
  })

  // Extrair appointments com segurança máxima
  const appointments = useMemo(() => {
    const data = query.data
    if (!data) return []
    if (Array.isArray(data)) return data
    if (Array.isArray(data.data)) return data.data
    if (data.appointments && Array.isArray(data.appointments)) return data.appointments
    return []
  }, [query.data])

  const meta = query.data?.meta || { total: 0, pages: 0 }

  useEffect(() => {
    if (query.data) {
      console.log('useAppointments - Final array:', appointments)
    }
  }, [query.data, appointments])

  const createMutation = useMutation({
    mutationFn: async (payload: Omit<Appointment, "id">) => {
      const res = await api.post("/appointments", payload)
      return res.data?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      toast.success("Agendamento criado com sucesso")
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao criar agendamento")
    }
  })

  const confirmMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/appointments/${id}/confirm`)
      return res.data?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      toast.success("Agendamento confirmado")
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao confirmar agendamento")
    }
  })

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/appointments/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      toast.success("Agendamento cancelado")
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao cancelar agendamento")
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Appointment> & { id: string }) => {
      const res = await api.put(`/appointments/${id}`, payload)
      return res.data?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      toast.success("Agendamento atualizado com sucesso")
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao atualizar agendamento")
    }
  })

  return {
    appointments,
    meta,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    createAppointment: createMutation,
    confirmAppointment: confirmMutation,
    cancelAppointment: cancelMutation,
    updateAppointment: updateMutation
  }
}
