"use client"
import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { FaceogramLegend, FALLBACK_LEGEND, getLegendColorMap } from "./faceogram-legend"
import type { FaceogramLegendItem } from "./faceogram-legend"
import type { FacialRegion, FaceogramEntry, Faceogram } from "@/hooks/useHof"

// Re-export types for convenience
export type { FacialRegion, FaceogramEntry }
export type FaceogramData = Faceogram

interface FaceogramChartProps {
  data?: FaceogramData
  legend?: FaceogramLegendItem[]
  onRegionClick?: (region: FacialRegion) => void
  selectedRegion?: FacialRegion | null
  readOnly?: boolean
}

// SVG path definitions for each facial region
const REGION_PATHS: Record<FacialRegion, { path: string; labelPos: { x: number; y: number } }> = {
  TESTA: {
    path: "M 100 30 Q 150 10 200 30 L 200 60 Q 150 55 100 60 Z",
    labelPos: { x: 150, y: 45 },
  },
  GLABELA: {
    path: "M 135 60 L 165 60 L 165 85 L 135 85 Z",
    labelPos: { x: 150, y: 72 },
  },
  TEMPORAL: {
    path: "M 50 50 Q 60 40 75 45 L 85 75 Q 70 80 55 75 Q 45 65 50 50 Z M 215 45 Q 230 40 250 50 Q 255 65 245 75 L 215 75 Q 225 80 215 45 Z",
    labelPos: { x: 60, y: 60 },
  },
  PERIORBICULAR: {
    path: "M 85 75 Q 95 65 120 70 Q 135 75 130 90 Q 120 100 95 95 Q 80 90 85 75 Z M 170 70 Q 195 65 215 75 Q 220 90 205 95 Q 180 100 170 90 Q 165 75 170 70 Z",
    labelPos: { x: 107, y: 85 },
  },
  NARIZ: {
    path: "M 135 85 L 150 85 L 165 85 L 165 130 Q 165 140 150 145 Q 135 140 135 130 Z",
    labelPos: { x: 150, y: 115 },
  },
  MALAR: {
    path: "M 55 95 Q 75 90 95 100 Q 100 125 85 140 Q 65 135 55 115 Q 50 100 55 95 Z M 205 100 Q 225 90 245 95 Q 250 100 245 115 Q 235 135 215 140 Q 200 125 205 100 Z",
    labelPos: { x: 75, y: 117 },
  },
  SULCO_NASOGENIANO: {
    path: "M 115 145 Q 120 135 130 140 L 130 165 Q 125 170 115 165 Z M 170 140 Q 180 135 185 145 L 185 165 Q 175 170 170 165 Z",
    labelPos: { x: 122, y: 155 },
  },
  LABIO_SUPERIOR: {
    path: "M 130 160 Q 140 155 150 152 Q 160 155 170 160 L 170 172 Q 160 168 150 168 Q 140 168 130 172 Z",
    labelPos: { x: 150, y: 165 },
  },
  LABIO_INFERIOR: {
    path: "M 130 175 Q 140 172 150 172 Q 160 172 170 175 L 170 190 Q 160 195 150 195 Q 140 195 130 190 Z",
    labelPos: { x: 150, y: 185 },
  },
  MENTO: {
    path: "M 125 195 Q 140 192 150 192 Q 160 192 175 195 Q 185 210 175 230 Q 160 245 150 245 Q 140 245 125 230 Q 115 210 125 195 Z",
    labelPos: { x: 150, y: 218 },
  },
  MANDIBULA: {
    path: "M 55 140 Q 70 145 85 145 L 120 195 Q 110 230 125 230 L 125 195 Q 115 175 95 160 Q 75 155 55 155 Q 45 150 55 140 Z M 180 145 Q 195 145 215 145 Q 230 145 245 140 Q 255 150 245 155 Q 225 155 205 160 Q 185 175 175 195 L 175 230 Q 190 230 180 195 L 215 145 Z",
    labelPos: { x: 85, y: 175 },
  },
}

// Region labels for display
const REGION_LABELS: Record<FacialRegion, string> = {
  TESTA: "Testa",
  GLABELA: "Glabela",
  TEMPORAL: "Temporal",
  PERIORBICULAR: "Periorbicular",
  NARIZ: "Nariz",
  MALAR: "Malar",
  SULCO_NASOGENIANO: "Sulco Nasogeniano",
  LABIO_SUPERIOR: "Lábio Superior",
  LABIO_INFERIOR: "Lábio Inferior",
  MENTO: "Mento",
  MANDIBULA: "Mandíbula",
}

export function FaceogramChart({
  data,
  legend,
  onRegionClick,
  selectedRegion,
  readOnly = false,
}: FaceogramChartProps) {
  const t = useTranslations("hof")
  const legendItems = legend && legend.length > 0 ? legend : FALLBACK_LEGEND
  const colorMap = useMemo(() => getLegendColorMap(legendItems), [legendItems])

  // Build a map of region -> latest active entries
  const regionEntriesMap = useMemo(() => {
    const map = new Map<FacialRegion, FaceogramEntry[]>()
    if (!data?.entries) return map

    for (const entry of data.entries) {
      if (!entry.is_active) continue
      const existing = map.get(entry.region) || []
      existing.push(entry)
      map.set(entry.region, existing)
    }
    return map
  }, [data])

  // Get color for a region based on its entries
  function getRegionColor(region: FacialRegion): string {
    const entries = regionEntriesMap.get(region)
    if (!entries || entries.length === 0) {
      return "#F3F4F6" // Default light gray
    }

    // Get the most recent entry
    const latest = entries.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]

    return colorMap.get(latest.procedure_type) || "#F3F4F6"
  }

  // Check if region has entries
  function regionHasEntries(region: FacialRegion): boolean {
    return (regionEntriesMap.get(region)?.length || 0) > 0
  }

  const regions = Object.keys(REGION_PATHS) as FacialRegion[]

  return (
    <div className="space-y-6">
      {/* SVG Face Diagram */}
      <div className="flex justify-center">
        <svg
          viewBox="0 0 300 280"
          className="w-full max-w-md"
          style={{ height: "auto" }}
        >
          {/* Face outline */}
          <ellipse
            cx="150"
            cy="140"
            rx="120"
            ry="140"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.2"
          />

          {/* Hair suggestion */}
          <path
            d="M 30 80 Q 60 20 150 10 Q 240 20 270 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.15"
          />

          {/* Ears */}
          <ellipse cx="30" cy="100" rx="12" ry="25" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
          <ellipse cx="270" cy="100" rx="12" ry="25" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />

          {/* Interactive regions */}
          {regions.map((region) => {
            const { path } = REGION_PATHS[region]
            const isSelected = selectedRegion === region
            const hasEntries = regionHasEntries(region)
            const fillColor = getRegionColor(region)

            return (
              <g
                key={region}
                onClick={() => !readOnly && onRegionClick?.(region)}
                className={readOnly ? "" : "cursor-pointer"}
                role={readOnly ? undefined : "button"}
                tabIndex={readOnly ? undefined : 0}
              >
                <path
                  d={path}
                  fill={fillColor}
                  stroke={isSelected ? "#0EA5E9" : hasEntries ? colorMap.get(getRegionColor(region)) || "#9CA3AF" : "#D1D5DB"}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  opacity={hasEntries ? 0.8 : 0.5}
                  className="transition-all duration-200 hover:opacity-100"
                />
                {/* Region label on hover - hidden by default for clean look */}
                <title>{REGION_LABELS[region]}</title>
              </g>
            )
          })}

          {/* Eye placeholders */}
          <ellipse cx="107" cy="85" rx="15" ry="10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <ellipse cx="193" cy="85" rx="15" ry="10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <circle cx="107" cy="85" r="5" fill="currentColor" opacity="0.2" />
          <circle cx="193" cy="85" r="5" fill="currentColor" opacity="0.2" />

          {/* Eyebrows */}
          <path d="M 85 70 Q 107 62 130 70" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <path d="M 170 70 Q 193 62 215 70" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />

          {/* Nose hint */}
          <path d="M 150 90 L 150 130" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />

          {/* Mouth hint */}
          <path d="M 135 175 Q 150 180 165 175" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        </svg>
      </div>

      {/* Region info when selected */}
      {selectedRegion && (
        <div className="text-center p-2 bg-primary/10 rounded-lg">
          <span className="text-sm font-medium text-primary">
            {t(`facialRegions.${selectedRegion}`)}
          </span>
          {regionHasEntries(selectedRegion) && (
            <span className="ml-2 text-xs text-muted-foreground">
              ({regionEntriesMap.get(selectedRegion)?.length || 0} {t("faceogram.history").toLowerCase()})
            </span>
          )}
        </div>
      )}

      {/* Legend */}
      <FaceogramLegend items={legendItems} />
    </div>
  )
}
