"use client"
import { useCallback } from "react"
import { useTranslations } from "next-intl"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { Surface } from "@/hooks/useOdontogram"

interface SurfacePickerProps {
  selectedSurfaces: Surface[]
  onSurfacesChange: (surfaces: Surface[]) => void
  statusColor?: string
}

const SURFACE_ZONES: { key: Surface; position: string }[] = [
  { key: "VB", position: "top" },
  { key: "LP", position: "bottom" },
  { key: "M", position: "left" },
  { key: "D", position: "right" },
  { key: "OI", position: "center" },
]

export function SurfacePicker({
  selectedSurfaces,
  onSurfacesChange,
  statusColor,
}: SurfacePickerProps) {
  const t = useTranslations("odontogram")

  const isWholeSelected = selectedSurfaces.includes("WHOLE")

  const toggleSurface = useCallback(
    (surface: Surface) => {
      if (surface === "WHOLE") {
        // Toggle WHOLE: if selected, clear all. If not, set only WHOLE.
        if (isWholeSelected) {
          onSurfacesChange([])
        } else {
          onSurfacesChange(["WHOLE"])
        }
        return
      }

      // If WHOLE is selected and user clicks individual surface, switch to individual mode
      if (isWholeSelected) {
        onSurfacesChange([surface])
        return
      }

      if (selectedSurfaces.includes(surface)) {
        onSurfacesChange(selectedSurfaces.filter((s) => s !== surface))
      } else {
        onSurfacesChange([...selectedSurfaces, surface])
      }
    },
    [selectedSurfaces, onSurfacesChange, isWholeSelected]
  )

  const isSurfaceSelected = (surface: Surface) =>
    isWholeSelected || selectedSurfaces.includes(surface)

  const highlightColor = statusColor || "hsl(var(--primary))"

  const surfaceLabels: Record<Surface, string> = {
    WHOLE: t("wholeTooth"),
    M: t("mesial"),
    D: t("distal"),
    OI: t("occlusalIncisal"),
    VB: t("vestibularBuccal"),
    LP: t("lingualPalatal"),
  }

  return (
    <div className="space-y-3">
      {/* Visual tooth diagram */}
      <div className="flex items-center justify-center">
        <div className="relative w-[120px] h-[120px]">
          {/* Top - VB (Vestibular/Buccal) */}
          <button
            type="button"
            onClick={() => toggleSurface("VB")}
            className={cn(
              "absolute top-0 left-1/2 -translate-x-1/2 w-[50px] h-[30px] rounded-t-lg border-2 transition-colors",
              "hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring"
            )}
            style={{
              backgroundColor: isSurfaceSelected("VB") ? highlightColor : "hsl(var(--muted))",
              borderColor: isSurfaceSelected("VB") ? highlightColor : "hsl(var(--border))",
            }}
            title={surfaceLabels.VB}
          >
            <span className="text-[9px] font-semibold text-foreground">VB</span>
          </button>

          {/* Bottom - LP (Lingual/Palatal) */}
          <button
            type="button"
            onClick={() => toggleSurface("LP")}
            className={cn(
              "absolute bottom-0 left-1/2 -translate-x-1/2 w-[50px] h-[30px] rounded-b-lg border-2 transition-colors",
              "hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring"
            )}
            style={{
              backgroundColor: isSurfaceSelected("LP") ? highlightColor : "hsl(var(--muted))",
              borderColor: isSurfaceSelected("LP") ? highlightColor : "hsl(var(--border))",
            }}
            title={surfaceLabels.LP}
          >
            <span className="text-[9px] font-semibold text-foreground">LP</span>
          </button>

          {/* Left - M (Mesial) */}
          <button
            type="button"
            onClick={() => toggleSurface("M")}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 w-[30px] h-[50px] rounded-l-lg border-2 transition-colors",
              "hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring"
            )}
            style={{
              backgroundColor: isSurfaceSelected("M") ? highlightColor : "hsl(var(--muted))",
              borderColor: isSurfaceSelected("M") ? highlightColor : "hsl(var(--border))",
            }}
            title={surfaceLabels.M}
          >
            <span className="text-[9px] font-semibold text-foreground">M</span>
          </button>

          {/* Right - D (Distal) */}
          <button
            type="button"
            onClick={() => toggleSurface("D")}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 w-[30px] h-[50px] rounded-r-lg border-2 transition-colors",
              "hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring"
            )}
            style={{
              backgroundColor: isSurfaceSelected("D") ? highlightColor : "hsl(var(--muted))",
              borderColor: isSurfaceSelected("D") ? highlightColor : "hsl(var(--border))",
            }}
            title={surfaceLabels.D}
          >
            <span className="text-[9px] font-semibold text-foreground">D</span>
          </button>

          {/* Center - OI (Oclusal/Incisal) */}
          <button
            type="button"
            onClick={() => toggleSurface("OI")}
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] rounded-md border-2 transition-colors",
              "hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring"
            )}
            style={{
              backgroundColor: isSurfaceSelected("OI") ? highlightColor : "hsl(var(--muted))",
              borderColor: isSurfaceSelected("OI") ? highlightColor : "hsl(var(--border))",
            }}
            title={surfaceLabels.OI}
          >
            <span className="text-[10px] font-semibold text-foreground">OI</span>
          </button>
        </div>
      </div>

      {/* Whole tooth checkbox */}
      <div className="flex items-center justify-center gap-2">
        <Checkbox
          id="surface-whole"
          checked={isWholeSelected}
          onCheckedChange={() => toggleSurface("WHOLE")}
        />
        <label
          htmlFor="surface-whole"
          className="text-sm font-medium cursor-pointer select-none"
        >
          {t("wholeTooth")}
        </label>
      </div>

      {/* Surface legend */}
      <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
        <span>M - {t("mesial")}</span>
        <span>D - {t("distal")}</span>
        <span>OI - {t("occlusalIncisal")}</span>
        <span>VB - {t("vestibularBuccal")}</span>
        <span className="col-span-2">LP - {t("lingualPalatal")}</span>
      </div>
    </div>
  )
}
