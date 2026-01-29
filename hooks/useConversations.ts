import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function useConversations(search?: string) {
  const query = useQuery({
    queryKey: ["conversations", search],
    queryFn: async () => {
      try {
        const res = await api.get("/conversations", { params: { q: search } })
        const data = res.data?.data
        return Array.isArray(data) ? data : []
      } catch (error) {
        console.error("Erro ao buscar conversas:", error)
        return []
      }
    }
  })

  return {
    conversations: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch
  }
}

export function useMessages(phone: string | null) {
  const query = useQuery({
    queryKey: ["messages", phone],
    queryFn: async () => {
      if (!phone) return []
      try {
        const res = await api.get(`/conversations/${phone}`)
        const data = res.data?.data
        return Array.isArray(data) ? data : []
      } catch (error) {
        console.error("Erro ao buscar mensagens:", error)
        return []
      }
    },
    enabled: !!phone
  })

  return {
    messages: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch
  }
}
