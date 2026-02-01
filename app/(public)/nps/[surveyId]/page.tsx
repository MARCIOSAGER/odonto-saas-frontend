"use client"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { Loader2, Star, CheckCircle2 } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

interface SurveyData {
  id: string
  score: number | null
  feedback: string | null
  answered_at: string | null
  patient: { name: string }
  clinic: { name: string; logo_url: string | null; primary_color: string | null } | null
}

export default function NpsResponsePage() {
  const params = useParams()
  const surveyId = params?.surveyId as string
  const [survey, setSurvey] = useState<SurveyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedScore, setSelectedScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const loadSurvey = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/nps/survey/${surveyId}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSurvey(data)
      if (data.answered_at) {
        setSubmitted(true)
        setSelectedScore(data.score)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [surveyId])

  useEffect(() => {
    if (surveyId) loadSurvey()
  }, [surveyId, loadSurvey])

  async function handleSubmit() {
    if (selectedScore === null) return
    setSubmitting(true)
    try {
      await fetch(`${API_URL}/nps/respond/${surveyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: selectedScore, feedback: feedback.trim() || undefined }),
      })
      setSubmitted(true)
    } catch {
      // ignore
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
      </div>
    )
  }

  if (error || !survey) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
        <div className="text-center space-y-3">
          <h1 className="text-xl font-bold">Link inv&aacute;lido</h1>
          <p className="text-gray-500">Esta pesquisa n&atilde;o existe ou j&aacute; expirou.</p>
        </div>
      </div>
    )
  }

  const accentColor = survey.clinic?.primary_color || "#0284c7"

  if (submitted) {
    const isPromoter = selectedScore !== null && selectedScore >= 9
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-4">
          <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
          <h1 className="text-2xl font-bold">Obrigado!</h1>
          <p className="text-gray-500">
            Sua avalia&ccedil;&atilde;o foi registrada com sucesso.
          </p>
          {isPromoter && (
            <div className="pt-4 space-y-3">
              <p className="text-sm text-gray-600">
                Ficamos muito felizes com sua avalia&ccedil;&atilde;o! Que tal compartilhar sua experi&ecirc;ncia no Google?
              </p>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(survey.clinic?.name || '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium text-sm"
                style={{ backgroundColor: accentColor }}
              >
                <Star className="h-4 w-4" />
                Avaliar no Google
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center text-white" style={{ backgroundColor: accentColor }}>
          <h1 className="text-xl font-bold">{survey.clinic?.name}</h1>
          <p className="text-sm opacity-90 mt-1">Pesquisa de satisfa&ccedil;&atilde;o</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-gray-700">
              Ol&aacute; <strong>{survey.patient.name}</strong>, como foi sua experi&ecirc;ncia?
            </p>
            <p className="text-sm text-gray-500 mt-1">De 0 a 10, qual a probabilidade de nos recomendar?</p>
          </div>

          {/* Score selector */}
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: 11 }, (_, i) => i).map((score) => (
              <button
                key={score}
                onClick={() => setSelectedScore(score)}
                className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                  selectedScore === score
                    ? "text-white shadow-lg scale-110"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                style={selectedScore === score ? { backgroundColor: accentColor } : undefined}
              >
                {score}
              </button>
            ))}
          </div>

          <div className="flex justify-between text-xs text-gray-400 px-1">
            <span>Nada prov&aacute;vel</span>
            <span>Muito prov&aacute;vel</span>
          </div>

          {/* Feedback */}
          {selectedScore !== null && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {selectedScore >= 9
                  ? "O que mais gostou?"
                  : selectedScore >= 7
                    ? "O que podemos melhorar?"
                    : "O que deu errado? Como podemos melhorar?"}
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Sua opini&atilde;o &eacute; muito importante... (opcional)"
                rows={3}
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
              />
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={selectedScore === null || submitting}
            className="w-full py-3 rounded-lg text-white font-medium transition-opacity disabled:opacity-50"
            style={{ backgroundColor: accentColor }}
          >
            {submitting ? "Enviando..." : "Enviar avalia\u00e7\u00e3o"}
          </button>
        </div>
      </div>
    </div>
  )
}
