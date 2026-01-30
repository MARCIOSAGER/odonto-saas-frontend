import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { useMemo } from "react"

export function useConversations(search?: string) {
  const query = useQuery({
    queryKey: ["conversations", search],
    queryFn: async () => {
      const res = await api.get("/conversations", { params: { q: search } })
      return res.data
    }
  })

  // Unwrap TransformInterceptor + pagination:
  // API returns: { success, data: { data: [...], meta }, timestamp }
  const conversations = useMemo(() => {
    const data = query.data
    if (!data) return []
    if (Array.isArray(data)) return data
    const payload = data.data
    if (Array.isArray(payload)) return payload
    if (payload && Array.isArray(payload.data)) return payload.data
    return []
  }, [query.data])

  return {
    conversations,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch
  }
}

export function useMessages(phone: string | null) {
  const query = useQuery({
    queryKey: ["messages", phone],
    queryFn: async () => {
      if (!phone) return null
      const res = await api.get(`/conversations/${phone}`)
      return res.data
    },
    enabled: !!phone
  })

  // Unwrap TransformInterceptor:
  // API returns: { success, data: { patient, data: [...messages], meta }, timestamp }
  const result = useMemo(() => {
    const data = query.data
    if (!data) return { messages: [], patient: null }
    // TransformInterceptor: data.data = { patient, data: [...], meta }
    const payload = data.data || data
    const innerData = payload.data || payload
    const messages = Array.isArray(innerData) ? innerData : (Array.isArray(innerData?.data) ? innerData.data : [])
    const patient = payload.patient || null
    return { messages, patient }
  }, [query.data])

  return {
    messages: result.messages,
    patient: result.patient,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch
  }
}

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ phone, message }: { phone: string; message: string }) => {
      const res = await api.post(`/conversations/${phone}/send`, { message })
      return res.data?.data || res.data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.phone] })
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao enviar mensagem")
    }
  })
}
