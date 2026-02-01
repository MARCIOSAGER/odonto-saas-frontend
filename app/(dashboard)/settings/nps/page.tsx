"use client"
import { useEffect, useState, useCallback } from "react"
import { api } from "@/lib/api"
import { Loader2, TrendingUp, TrendingDown, Minus, Send, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NpsStats {
  total_responses: number
  nps_score: number
  promoters: number
  passives: number
  detractors: number
  promoter_pct: number
  passive_pct: number
  detractor_pct: number
  monthly: { month: string; nps: number; responses: number }[]
}

interface NpsResponse {
  id: string
  score: number | null
  feedback: string | null
  sent_at: string
  answered_at: string | null
  patient: { name: string; phone: string }
}

export default function NpsSettingsPage() {
  const [stats, setStats] = useState<NpsStats | null>(null)
  const [responses, setResponses] = useState<NpsResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadData = useCallback(async () => {
    try {
      const [statsRes, responsesRes] = await Promise.all([
        api.get("/nps/stats"),
        api.get(`/nps/responses?page=${page}&limit=15`),
      ])
      setStats(statsRes.data?.data || statsRes.data)
      const respBody = responsesRes.data?.data || responsesRes.data
      setResponses(respBody?.data || [])
      setTotalPages(respBody?.meta?.totalPages || 1)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const npsColor = (stats?.nps_score ?? 0) >= 50 ? "text-green-600" : (stats?.nps_score ?? 0) >= 0 ? "text-amber-600" : "text-red-600"
  const npsIcon = (stats?.nps_score ?? 0) >= 50 ? TrendingUp : (stats?.nps_score ?? 0) >= 0 ? Minus : TrendingDown

  const NpsIcon = npsIcon

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">NPS &amp; Avalia&ccedil;&otilde;es</h1>
        <p className="text-sm text-muted-foreground mt-1">Acompanhe a satisfa&ccedil;&atilde;o dos seus pacientes</p>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-xl p-5 space-y-1">
          <p className="text-xs text-muted-foreground font-medium">NPS Score</p>
          <div className="flex items-center gap-2">
            <span className={`text-3xl font-bold ${npsColor}`}>{stats?.nps_score ?? 0}</span>
            <NpsIcon className={`h-5 w-5 ${npsColor}`} />
          </div>
        </div>
        <div className="bg-card border rounded-xl p-5 space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Promotores (9-10)</p>
          <p className="text-2xl font-bold text-green-600">{stats?.promoter_pct ?? 0}%</p>
          <p className="text-xs text-muted-foreground">{stats?.promoters ?? 0} respostas</p>
        </div>
        <div className="bg-card border rounded-xl p-5 space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Neutros (7-8)</p>
          <p className="text-2xl font-bold text-amber-600">{stats?.passive_pct ?? 0}%</p>
          <p className="text-xs text-muted-foreground">{stats?.passives ?? 0} respostas</p>
        </div>
        <div className="bg-card border rounded-xl p-5 space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Detratores (0-6)</p>
          <p className="text-2xl font-bold text-red-600">{stats?.detractor_pct ?? 0}%</p>
          <p className="text-xs text-muted-foreground">{stats?.detractors ?? 0} respostas</p>
        </div>
      </div>

      {/* NPS bar */}
      {stats && stats.total_responses > 0 && (
        <div className="bg-card border rounded-xl p-5 space-y-3">
          <p className="text-sm font-medium">Distribui&ccedil;&atilde;o</p>
          <div className="flex h-6 rounded-full overflow-hidden">
            {stats.promoter_pct > 0 && (
              <div className="bg-green-500 flex items-center justify-center text-white text-xs font-medium" style={{ width: `${stats.promoter_pct}%` }}>
                {stats.promoter_pct}%
              </div>
            )}
            {stats.passive_pct > 0 && (
              <div className="bg-amber-400 flex items-center justify-center text-white text-xs font-medium" style={{ width: `${stats.passive_pct}%` }}>
                {stats.passive_pct}%
              </div>
            )}
            {stats.detractor_pct > 0 && (
              <div className="bg-red-500 flex items-center justify-center text-white text-xs font-medium" style={{ width: `${stats.detractor_pct}%` }}>
                {stats.detractor_pct}%
              </div>
            )}
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Promotores</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Neutros</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Detratores</span>
          </div>
        </div>
      )}

      {/* Monthly evolution */}
      {stats && stats.monthly.length > 0 && (
        <div className="bg-card border rounded-xl p-5 space-y-3">
          <p className="text-sm font-medium">Evolu&ccedil;&atilde;o mensal</p>
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-max">
              {stats.monthly.map((m) => (
                <div key={m.month} className="text-center space-y-1">
                  <div className={`text-lg font-bold ${m.nps >= 50 ? "text-green-600" : m.nps >= 0 ? "text-amber-600" : "text-red-600"}`}>
                    {m.nps}
                  </div>
                  <div className="text-xs text-muted-foreground">{m.responses} resp.</div>
                  <div className="text-xs font-medium">{m.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Responses table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="p-5 border-b">
          <p className="text-sm font-medium flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Respostas ({stats?.total_responses ?? 0})
          </p>
        </div>
        {responses.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Nenhuma pesquisa enviada ainda
          </div>
        ) : (
          <div className="divide-y">
            {responses.map((r) => (
              <div key={r.id} className="p-4 flex items-start gap-4">
                <div className="flex-shrink-0">
                  {r.score !== null ? (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white ${
                      r.score >= 9 ? "bg-green-500" : r.score >= 7 ? "bg-amber-400" : "bg-red-500"
                    }`}>
                      {r.score}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <Send className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{r.patient.name}</span>
                    {!r.answered_at && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Pendente</span>}
                  </div>
                  {r.feedback && <p className="text-sm text-muted-foreground mt-1">{r.feedback}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    Enviado em {new Date(r.sent_at).toLocaleDateString("pt-BR")}
                    {r.answered_at && ` - Respondido em ${new Date(r.answered_at).toLocaleDateString("pt-BR")}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <div className="p-4 border-t flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</Button>
            <span className="text-xs text-muted-foreground">P&aacute;gina {page} de {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Pr&oacute;xima</Button>
          </div>
        )}
      </div>
    </div>
  )
}
