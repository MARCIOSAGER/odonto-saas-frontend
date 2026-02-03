"use client"
import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { Loader2, AlertCircle } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OdontogramChart } from "./odontogram-chart"
import { ToothDetailPanel } from "./tooth-detail-panel"
import { useOdontogram, useOdontogramLegend } from "@/hooks/useOdontogram"
import type { DentitionType, OdontogramEntry } from "@/hooks/useOdontogram"

interface Props {
  patientId: string
  readOnly?: boolean
}

export function OdontogramViewer({ patientId, readOnly = false }: Props) {
  const t = useTranslations("odontogram")
  const [dentitionType, setDentitionType] = useState<DentitionType>("PERMANENT")
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)

  // Fetch odontogram data via TanStack Query
  const {
    data: odontogramData,
    isLoading: odontogramLoading,
    isError: odontogramError,
  } = useOdontogram(patientId, dentitionType)

  // Fetch legend data
  const { data: legendData, isLoading: legendLoading } = useOdontogramLegend()

  const teeth = odontogramData?.teeth || []
  const legend = legendData || []

  // Get entries for the selected tooth
  const selectedToothEntries = useMemo<OdontogramEntry[]>(() => {
    if (!selectedTooth) return []
    const tooth = teeth.find((t) => t.tooth_number === selectedTooth)
    return tooth?.entries || []
  }, [selectedTooth, teeth])

  function handleToothClick(toothNumber: number) {
    if (readOnly) return
    setSelectedTooth(toothNumber)
    setPanelOpen(true)
  }

  function handlePanelClose(open: boolean) {
    setPanelOpen(open)
    if (!open) {
      setSelectedTooth(null)
    }
  }

  const isLoading = odontogramLoading || legendLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (odontogramError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
        <AlertCircle className="h-6 w-6" />
        <span className="text-sm">{t("loadError")}</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Dentition type selector */}
      <div className="flex justify-center">
        <Tabs
          value={dentitionType}
          onValueChange={(v) => setDentitionType(v as DentitionType)}
        >
          <TabsList>
            <TabsTrigger value="PERMANENT">
              {t("permanentDentition")}
            </TabsTrigger>
            <TabsTrigger value="DECIDUOUS">
              {t("deciduousDentition")}
            </TabsTrigger>
            <TabsTrigger value="MIXED">
              {t("mixedDentition")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Odontogram chart */}
      <OdontogramChart
        teeth={teeth}
        legend={legend}
        dentitionType={dentitionType}
        onToothClick={handleToothClick}
        selectedTooth={selectedTooth}
        readOnly={readOnly}
      />

      {/* Tooth detail side panel */}
      {!readOnly && (
        <ToothDetailPanel
          patientId={patientId}
          toothNumber={selectedTooth}
          open={panelOpen}
          onOpenChange={handlePanelClose}
          legend={legend}
          currentEntries={selectedToothEntries}
        />
      )}
    </div>
  )
}
