import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { toast } from "sonner"

// ─── Types ──────────────────────────────────────────────────────────

export type DentitionType = "PERMANENT" | "DECIDUOUS" | "MIXED"

export type EntryType = "FINDING" | "PROCEDURE" | "NOTE"

export type Surface = "WHOLE" | "M" | "D" | "OI" | "VB" | "LP"

export interface OdontogramEntry {
  id: string
  tooth_number: number
  entry_type: EntryType
  status_code: string
  surfaces: Surface[]
  notes?: string | null
  is_active: boolean
  superseded_at?: string | null
  superseded_by?: string | null
  supersede_notes?: string | null
  created_by: string
  created_by_name?: string
  created_at: string
  updated_at: string
}

export interface OdontogramTooth {
  tooth_number: number
  entries: OdontogramEntry[]
}

export interface OdontogramData {
  id: string
  patient_id: string
  dentition_type: DentitionType
  teeth: OdontogramTooth[]
}

export interface OdontogramLegendItem {
  id: string
  status_code: string
  label: string
  color: string
  border_color: string
  category: "finding" | "procedure" | "general"
  is_active: boolean
  display_order: number
}

export interface OdontogramHistoryFilters {
  tooth_number?: number
  entry_type?: EntryType
  include_superseded?: boolean
  page?: number
  limit?: number
}

export interface CreateEntryPayload {
  tooth_number: number
  entry_type: EntryType
  status_code: string
  surfaces: Surface[]
  notes?: string
}

export interface SupersedeEntryPayload {
  notes?: string
}

// ─── Hooks ──────────────────────────────────────────────────────────

/**
 * Fetches the odontogram for a patient with active entries.
 */
export function useOdontogram(patientId: string, dentitionType?: DentitionType) {
  return useQuery({
    queryKey: ["odontogram", patientId, dentitionType],
    queryFn: async () => {
      const res = await api.get(`/patients/${patientId}/odontogram`, {
        params: dentitionType ? { dentition_type: dentitionType } : undefined,
      })
      const data = res.data?.data || res.data
      return data as OdontogramData
    },
    enabled: !!patientId,
  })
}

/**
 * Fetches the history of odontogram entries for a patient,
 * optionally filtered by tooth, type, etc.
 */
export function useOdontogramHistory(
  patientId: string,
  filters?: OdontogramHistoryFilters
) {
  return useQuery({
    queryKey: ["odontogram-history", patientId, filters],
    queryFn: async () => {
      const res = await api.get(`/patients/${patientId}/odontogram/history`, {
        params: {
          tooth_number: filters?.tooth_number,
          entry_type: filters?.entry_type,
          include_superseded: filters?.include_superseded ?? false,
          page: filters?.page ?? 1,
          limit: filters?.limit ?? 50,
        },
      })
      const payload = res.data?.data || res.data
      // Handle paginated response
      if (payload && Array.isArray(payload.data)) {
        return {
          entries: payload.data as OdontogramEntry[],
          meta: payload.meta as { total: number; page: number; limit: number },
        }
      }
      return {
        entries: (Array.isArray(payload) ? payload : []) as OdontogramEntry[],
        meta: { total: 0, page: 1, limit: 50 },
      }
    },
    enabled: !!patientId,
  })
}

/**
 * Mutation to create a new odontogram entry (finding, procedure, or note).
 */
export function useCreateEntry(patientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateEntryPayload) => {
      const res = await api.post(
        `/patients/${patientId}/odontogram/entries`,
        payload
      )
      return res.data?.data || res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["odontogram", patientId] })
      queryClient.invalidateQueries({
        queryKey: ["odontogram-history", patientId],
      })
      toast.success("Registro salvo com sucesso")
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Erro ao salvar registro no odontograma"
      )
    },
  })
}

/**
 * Mutation to supersede (correct) an existing odontogram entry.
 */
export function useSupersedeEntry(patientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      entryId,
      notes,
    }: {
      entryId: string
      notes?: string
    }) => {
      const res = await api.patch(
        `/patients/${patientId}/odontogram/entries/${entryId}/supersede`,
        { notes }
      )
      return res.data?.data || res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["odontogram", patientId] })
      queryClient.invalidateQueries({
        queryKey: ["odontogram-history", patientId],
      })
      toast.success("Registro corrigido com sucesso")
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Erro ao corrigir registro"
      )
    },
  })
}

/**
 * Fetches the clinic's odontogram legend items (status codes, colors, categories).
 */
export function useOdontogramLegend() {
  return useQuery({
    queryKey: ["odontogram-legend"],
    queryFn: async () => {
      const res = await api.get("/clinics/odontogram/legend")
      const data = res.data?.data || res.data
      return (Array.isArray(data) ? data : []) as OdontogramLegendItem[]
    },
    staleTime: 5 * 60 * 1000, // Legend rarely changes, cache for 5 minutes
  })
}
