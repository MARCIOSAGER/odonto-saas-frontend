"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { toast } from "sonner"

// Types
export type HofProcedureType =
  | "TOXINA_BOTULINICA"
  | "PREENCHIMENTO_HA"
  | "BIOESTIMULADOR_COLAGENO"
  | "FIOS_PDO"
  | "SKINBOOSTER"
  | "OUTRO"

export type FacialRegion =
  | "TESTA"
  | "GLABELA"
  | "PERIORBICULAR"
  | "NARIZ"
  | "SULCO_NASOGENIANO"
  | "LABIO_SUPERIOR"
  | "LABIO_INFERIOR"
  | "MENTO"
  | "MANDIBULA"
  | "MALAR"
  | "TEMPORAL"

export interface HofDashboard {
  totalProcedures: number
  totalRevenue: number
  totalPatients: number
  scheduledSessions: number
  period: {
    start: string
    end: string
  }
}

export interface HofProcedure {
  id: string
  sessionId: string
  date: string
  patientId: string
  patientName: string
  procedureType: HofProcedureType
  facialRegion: FacialRegion
  productName: string | null
  quantity: string | null
  dentistId: string | null
  status: string
}

export interface HofLegendItem {
  id: string
  clinic_id: string
  procedure_type: HofProcedureType
  label: string
  color: string
  icon: string | null
  sort_order: number
  is_active: boolean
}

interface RecentProceduresParams {
  limit?: number
  page?: number
  procedureType?: HofProcedureType
  dentistId?: string
}

interface ReportParams {
  start?: string
  end?: string
}

// Dashboard hook
export function useHofDashboard(start?: string, end?: string) {
  return useQuery({
    queryKey: ["hof-dashboard", start, end],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (start) params.append("start", start)
      if (end) params.append("end", end)
      const url = `/hof/dashboard${params.toString() ? `?${params}` : ""}`
      const res = await api.get(url)
      return (res.data?.data || res.data) as HofDashboard
    },
    staleTime: 30 * 1000,
  })
}

// Recent procedures hook
export function useHofRecentProcedures(params: RecentProceduresParams = {}) {
  const { limit = 20, page = 1, procedureType, dentistId } = params

  return useQuery({
    queryKey: ["hof-recent-procedures", limit, page, procedureType, dentistId],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      searchParams.append("limit", limit.toString())
      searchParams.append("page", page.toString())
      if (procedureType) searchParams.append("procedureType", procedureType)
      if (dentistId) searchParams.append("dentistId", dentistId)
      const res = await api.get(`/hof/recent-procedures?${searchParams}`)
      return res.data?.data || res.data
    },
    staleTime: 30 * 1000,
  })
}

// Legend hook
export function useHofLegend() {
  return useQuery({
    queryKey: ["hof-legend"],
    queryFn: async () => {
      const res = await api.get("/hof/legend")
      return (res.data?.data || res.data) as HofLegendItem[]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Revenue report hook
export function useHofRevenueReport(params: ReportParams = {}) {
  const { start, end } = params

  return useQuery({
    queryKey: ["hof-revenue-report", start, end],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (start) searchParams.append("start", start)
      if (end) searchParams.append("end", end)
      const res = await api.get(`/hof/reports/revenue?${searchParams}`)
      return res.data?.data || res.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

// Procedures report hook
export function useHofProceduresReport(params: ReportParams = {}) {
  const { start, end } = params

  return useQuery({
    queryKey: ["hof-procedures-report", start, end],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (start) searchParams.append("start", start)
      if (end) searchParams.append("end", end)
      const res = await api.get(`/hof/reports/procedures?${searchParams}`)
      return res.data?.data || res.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

// Products report hook
export function useHofProductsReport(params: ReportParams = {}) {
  const { start, end } = params

  return useQuery({
    queryKey: ["hof-products-report", start, end],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (start) searchParams.append("start", start)
      if (end) searchParams.append("end", end)
      const res = await api.get(`/hof/reports/products?${searchParams}`)
      return res.data?.data || res.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

// Helper for procedure type labels (Portuguese)
export const PROCEDURE_TYPE_LABELS: Record<HofProcedureType, string> = {
  TOXINA_BOTULINICA: "Toxina Botulínica",
  PREENCHIMENTO_HA: "Preenchimento HA",
  BIOESTIMULADOR_COLAGENO: "Bioestimulador de Colágeno",
  FIOS_PDO: "Fios PDO",
  SKINBOOSTER: "Skinbooster",
  OUTRO: "Outro",
}

// Helper for facial region labels (Portuguese)
export const FACIAL_REGION_LABELS: Record<FacialRegion, string> = {
  TESTA: "Testa",
  GLABELA: "Glabela",
  PERIORBICULAR: "Periorbicular",
  NARIZ: "Nariz",
  SULCO_NASOGENIANO: "Sulco Nasogeniano",
  LABIO_SUPERIOR: "Lábio Superior",
  LABIO_INFERIOR: "Lábio Inferior",
  MENTO: "Mento",
  MANDIBULA: "Mandíbula",
  MALAR: "Malar",
  TEMPORAL: "Temporal",
}

// Default legend colors
export const DEFAULT_LEGEND_COLORS: Record<HofProcedureType, string> = {
  TOXINA_BOTULINICA: "#3B82F6",
  PREENCHIMENTO_HA: "#10B981",
  BIOESTIMULADOR_COLAGENO: "#F59E0B",
  FIOS_PDO: "#8B5CF6",
  SKINBOOSTER: "#EC4899",
  OUTRO: "#6B7280",
}

// Faceogram types
export interface FaceogramEntry {
  id: string
  faceogram_id: string
  region: FacialRegion
  procedure_type: HofProcedureType
  product_name: string | null
  quantity: string | null
  notes: string | null
  is_active: boolean
  superseded_by_id: string | null
  superseded_reason: string | null
  created_at: string
  created_by_id: string
  created_by_name?: string
}

export interface Faceogram {
  id: string
  patient_id: string
  clinic_id: string
  entries: FaceogramEntry[]
}

interface CreateEntryInput {
  region: FacialRegion
  procedure_type: HofProcedureType
  product_name?: string
  quantity?: string
  notes?: string
}

interface SupersedeEntryInput {
  entryId: string
  reason: string
}

// Faceogram hook - follows Odontogram pattern
export function useFaceogram(patientId: string) {
  const queryClient = useQueryClient()

  // Get or create faceogram
  const {
    data: faceogram,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["faceogram", patientId],
    queryFn: async () => {
      const res = await api.get(`/patients/${patientId}/faceogram`)
      return (res.data?.data || res.data) as Faceogram
    },
    enabled: !!patientId,
    staleTime: 30 * 1000,
  })

  // Get legend for colors
  const { data: legend } = useHofLegend()

  // Create entry mutation
  const createEntryMutation = useMutation({
    mutationFn: async (input: CreateEntryInput) => {
      const res = await api.post(`/patients/${patientId}/faceogram/entries`, input)
      return res.data?.data || res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faceogram", patientId] })
      toast.success("Registro adicionado com sucesso")
    },
    onError: () => {
      toast.error("Erro ao adicionar registro")
    },
  })

  // Supersede (correct) entry mutation
  const supersedeEntryMutation = useMutation({
    mutationFn: async ({ entryId, reason }: SupersedeEntryInput) => {
      const res = await api.post(`/faceogram/entries/${entryId}/supersede`, { reason })
      return res.data?.data || res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faceogram", patientId] })
      toast.success("Registro corrigido com sucesso")
    },
    onError: () => {
      toast.error("Erro ao corrigir registro")
    },
  })

  return {
    faceogram,
    legend,
    isLoading,
    error,
    createEntry: createEntryMutation.mutateAsync,
    supersedeEntry: supersedeEntryMutation.mutateAsync,
    isCreating: createEntryMutation.isPending,
    isSuperseding: supersedeEntryMutation.isPending,
  }
}

// HOF Anamnesis types
export interface HofAnamnesis {
  id: string
  patient_id: string
  fitzpatrick_type: string | null
  skin_conditions: string | null
  previous_treatments: string | null
  allergies: string | null
  medications: string | null
  expectations: string | null
  contraindications: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

// HOF Anamnesis hook
export function useHofAnamnesis(patientId: string) {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ["hof-anamnesis", patientId],
    queryFn: async () => {
      const res = await api.get(`/patients/${patientId}/hof-anamnesis`)
      return (res.data?.data || res.data) as HofAnamnesis | null
    },
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000,
  })

  const saveMutation = useMutation({
    mutationFn: async (input: Partial<HofAnamnesis>) => {
      const res = await api.post(`/patients/${patientId}/hof-anamnesis`, input)
      return res.data?.data || res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hof-anamnesis", patientId] })
      toast.success("Anamnese salva com sucesso")
    },
    onError: () => {
      toast.error("Erro ao salvar anamnese")
    },
  })

  return {
    anamnesis: data,
    isLoading,
    error,
    save: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
  }
}

// HOF Session types
export interface HofSession {
  id: string
  patient_id: string
  date: string
  dentist_id: string | null
  dentist_name?: string
  notes: string | null
  status: string
  created_at: string
}

// HOF Sessions hook
export function useHofSessions(patientId: string) {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ["hof-sessions", patientId],
    queryFn: async () => {
      const res = await api.get(`/patients/${patientId}/hof-sessions`)
      return (res.data?.data || res.data) as HofSession[]
    },
    enabled: !!patientId,
    staleTime: 30 * 1000,
  })

  const createMutation = useMutation({
    mutationFn: async (input: Partial<HofSession>) => {
      const res = await api.post(`/patients/${patientId}/hof-sessions`, input)
      return res.data?.data || res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hof-sessions", patientId] })
      toast.success("Sessão criada com sucesso")
    },
    onError: () => {
      toast.error("Erro ao criar sessão")
    },
  })

  return {
    sessions: data || [],
    isLoading,
    error,
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  }
}

// HOF Photos hook
export interface HofPhoto {
  id: string
  patient_id: string
  session_id: string | null
  photo_type: "BEFORE" | "AFTER" | "PROGRESS"
  url: string
  caption: string | null
  annotations: string | null
  created_at: string
}

export function useHofPhotos(patientId: string) {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ["hof-photos", patientId],
    queryFn: async () => {
      const res = await api.get(`/patients/${patientId}/hof-photos`)
      return (res.data?.data || res.data) as HofPhoto[]
    },
    enabled: !!patientId,
    staleTime: 30 * 1000,
  })

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post(`/patients/${patientId}/hof-photos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      return res.data?.data || res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hof-photos", patientId] })
      toast.success("Foto enviada com sucesso")
    },
    onError: () => {
      toast.error("Erro ao enviar foto")
    },
  })

  return {
    photos: data || [],
    isLoading,
    error,
    upload: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
  }
}

// HOF Plan hook
export interface HofPlanItem {
  id: string
  patient_id: string
  procedure_type: HofProcedureType
  facial_region: FacialRegion
  product_name: string | null
  quantity: string | null
  estimated_price: number | null
  notes: string | null
  is_completed: boolean
  completed_at: string | null
  sort_order: number
}

export function useHofPlan(patientId: string) {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ["hof-plan", patientId],
    queryFn: async () => {
      const res = await api.get(`/patients/${patientId}/hof-plan`)
      return (res.data?.data || res.data) as HofPlanItem[]
    },
    enabled: !!patientId,
    staleTime: 30 * 1000,
  })

  const createMutation = useMutation({
    mutationFn: async (input: Partial<HofPlanItem>) => {
      const res = await api.post(`/patients/${patientId}/hof-plan`, input)
      return res.data?.data || res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hof-plan", patientId] })
      toast.success("Item adicionado ao plano")
    },
    onError: () => {
      toast.error("Erro ao adicionar item")
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...input }: Partial<HofPlanItem> & { id: string }) => {
      const res = await api.patch(`/hof-plan/${id}`, input)
      return res.data?.data || res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hof-plan", patientId] })
    },
    onError: () => {
      toast.error("Erro ao atualizar item")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/hof-plan/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hof-plan", patientId] })
      toast.success("Item removido do plano")
    },
    onError: () => {
      toast.error("Erro ao remover item")
    },
  })

  return {
    items: data || [],
    isLoading,
    error,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
  }
}

// HOF Consent hook
export interface HofConsent {
  id: string
  session_id: string
  template_content: string
  patient_signature: string | null
  signed_at: string | null
  witness_name: string | null
  witness_signature: string | null
  pdf_url: string | null
  created_at: string
}

export function useHofConsent(sessionId: string) {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ["hof-consent", sessionId],
    queryFn: async () => {
      const res = await api.get(`/hof-sessions/${sessionId}/consent`)
      return (res.data?.data || res.data) as HofConsent | null
    },
    enabled: !!sessionId,
    staleTime: 30 * 1000,
  })

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/hof-sessions/${sessionId}/consent`)
      return res.data?.data || res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hof-consent", sessionId] })
      toast.success("Termo criado com sucesso")
    },
    onError: () => {
      toast.error("Erro ao criar termo")
    },
  })

  const signMutation = useMutation({
    mutationFn: async (input: { signature: string; witnessName?: string; witnessSignature?: string }) => {
      const res = await api.post(`/hof-consent/${data?.id}/sign`, input)
      return res.data?.data || res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hof-consent", sessionId] })
      toast.success("Termo assinado com sucesso")
    },
    onError: () => {
      toast.error("Erro ao assinar termo")
    },
  })

  return {
    consent: data,
    isLoading,
    error,
    create: createMutation.mutateAsync,
    sign: signMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isSigning: signMutation.isPending,
  }
}
