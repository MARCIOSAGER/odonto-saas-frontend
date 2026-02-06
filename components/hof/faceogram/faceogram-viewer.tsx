"use client"
import { useState, useMemo, useCallback } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { FaceogramChart } from "./faceogram-chart"
import { FacialRegionPanel } from "./facial-region-panel"
import { getLegendColorMap } from "./faceogram-legend"
import { useFaceogram, type HofProcedureType, type FacialRegion, type FaceogramEntry } from "@/hooks/useHof"

interface FaceogramViewerProps {
  patientId: string
  readOnly?: boolean
}

export function FaceogramViewer({ patientId, readOnly = false }: FaceogramViewerProps) {
  const t = useTranslations("hof")

  const [selectedRegion, setSelectedRegion] = useState<FacialRegion | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)

  const {
    faceogram,
    legend,
    isLoading,
    error,
    createEntry,
    supersedeEntry,
    isCreating,
    isSuperseding,
  } = useFaceogram(patientId)

  const colorMap = useMemo(
    () => getLegendColorMap(legend || []),
    [legend]
  )

  // Get entries for selected region
  const selectedRegionEntries = useMemo(() => {
    if (!selectedRegion || !faceogram?.entries) return []
    return faceogram.entries.filter((e: FaceogramEntry) => e.region === selectedRegion)
  }, [selectedRegion, faceogram])

  const handleRegionClick = useCallback((region: FacialRegion) => {
    setSelectedRegion(region)
    setPanelOpen(true)
  }, [])

  const handleAddEntry = useCallback(
    async (data: {
      procedure_type: HofProcedureType
      product_name?: string
      quantity?: string
      notes?: string
    }) => {
      if (!selectedRegion) return

      try {
        await createEntry({
          region: selectedRegion,
          ...data,
        })
        toast.success("Registro adicionado com sucesso")
      } catch {
        toast.error("Erro ao adicionar registro")
      }
    },
    [selectedRegion, createEntry, toast, t]
  )

  const handleCorrectEntry = useCallback(
    async (entryId: string, reason: string) => {
      try {
        await supersedeEntry({ entryId, reason })
        toast.success("Registro corrigido com sucesso")
      } catch {
        toast.error("Erro ao corrigir registro")
      }
    },
    [supersedeEntry]
  )

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <p className="text-sm text-destructive">Erro ao carregar faceograma</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("faceogram.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <FaceogramChart
          data={faceogram}
          legend={legend}
          onRegionClick={handleRegionClick}
          selectedRegion={selectedRegion}
          readOnly={readOnly}
        />

        <FacialRegionPanel
          open={panelOpen}
          onOpenChange={setPanelOpen}
          region={selectedRegion}
          entries={selectedRegionEntries}
          onAddEntry={handleAddEntry}
          onCorrectEntry={handleCorrectEntry}
          readOnly={readOnly}
          colorMap={colorMap}
        />
      </CardContent>
    </Card>
  )
}
