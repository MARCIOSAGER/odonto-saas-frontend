"use client"
import { useEffect, useState, useCallback } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { OdontogramChart } from "./odontogram-chart"

interface Tooth {
  tooth_number: number
  status: string
  surfaces?: Record<string, string> | null
  notes?: string | null
}

interface Props {
  patientId: string
}

export function OdontogramViewer({ patientId }: Props) {
  const [teeth, setTeeth] = useState<Tooth[]>([])
  const [loading, setLoading] = useState(true)

  const loadOdontogram = useCallback(async () => {
    try {
      const res = await api.get(`/patients/${patientId}/odontogram`)
      const data = res.data?.data || res.data
      setTeeth(data?.teeth || [])
    } catch {
      // No odontogram yet - start with empty
      setTeeth([])
    } finally {
      setLoading(false)
    }
  }, [patientId])

  useEffect(() => {
    loadOdontogram()
  }, [loadOdontogram])

  async function handleToothUpdate(toothNumber: number, status: string, notes?: string) {
    try {
      await api.put(`/patients/${patientId}/odontogram/teeth/${toothNumber}`, {
        tooth_number: toothNumber,
        status,
        notes,
      })

      setTeeth((prev) => {
        const existing = prev.find((t) => t.tooth_number === toothNumber)
        if (existing) {
          return prev.map((t) =>
            t.tooth_number === toothNumber ? { ...t, status, notes } : t
          )
        }
        return [...prev, { tooth_number: toothNumber, status, notes }]
      })

      toast.success(`Dente ${toothNumber} atualizado`)
    } catch {
      toast.error("Erro ao atualizar dente")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <OdontogramChart
      teeth={teeth}
      onToothUpdate={handleToothUpdate}
    />
  )
}
