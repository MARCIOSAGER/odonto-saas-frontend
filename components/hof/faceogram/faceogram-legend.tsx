"use client"
import { useTranslations } from "next-intl"

export interface FaceogramLegendItem {
  id: string
  procedure_type: string
  label: string
  color: string
}

// Fallback legend if none is provided from the server
export const FALLBACK_LEGEND: FaceogramLegendItem[] = [
  { id: "1", procedure_type: "TOXINA_BOTULINICA", label: "Toxina Botulínica", color: "#3B82F6" },
  { id: "2", procedure_type: "PREENCHIMENTO_HA", label: "Preenchimento HA", color: "#10B981" },
  { id: "3", procedure_type: "BIOESTIMULADOR_COLAGENO", label: "Bioestimulador", color: "#F59E0B" },
  { id: "4", procedure_type: "FIOS_PDO", label: "Fios PDO", color: "#8B5CF6" },
  { id: "5", procedure_type: "SKINBOOSTER", label: "Skinbooster", color: "#EC4899" },
  { id: "6", procedure_type: "OUTRO", label: "Outro", color: "#6B7280" },
]

export function getLegendColorMap(items: FaceogramLegendItem[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const item of items) {
    map.set(item.procedure_type, item.color)
  }
  return map
}

interface FaceogramLegendProps {
  items?: FaceogramLegendItem[]
}

export function FaceogramLegend({ items }: FaceogramLegendProps) {
  const t = useTranslations("hof")
  const legendItems = items && items.length > 0 ? items : FALLBACK_LEGEND

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
      <span className="text-sm font-medium text-muted-foreground mr-2">
        {t("legend")}:
      </span>
      {legendItems.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
