"use client"
import { useTranslations } from "next-intl"
import type { OdontogramLegendItem } from "@/hooks/useOdontogram"

// ─── Fallback defaults (used when API legend is not yet loaded) ─────

const FALLBACK_STATUSES: OdontogramLegendItem[] = [
  { id: "f1", status_code: "healthy", label: "Saudavel", color: "#FFFFFF", border_color: "#D1D5DB", category: "general", is_active: true, display_order: 0 },
  { id: "f2", status_code: "cavity", label: "Carie", color: "#EF4444", border_color: "#EF4444", category: "finding", is_active: true, display_order: 1 },
  { id: "f3", status_code: "fracture", label: "Fratura", color: "#EC4899", border_color: "#EC4899", category: "finding", is_active: true, display_order: 2 },
  { id: "f4", status_code: "missing", label: "Ausente", color: "#E5E7EB", border_color: "#9CA3AF", category: "finding", is_active: true, display_order: 3 },
  { id: "f5", status_code: "restoration", label: "Restauracao", color: "#3B82F6", border_color: "#3B82F6", category: "procedure", is_active: true, display_order: 4 },
  { id: "f6", status_code: "extraction", label: "Extracao", color: "#9CA3AF", border_color: "#9CA3AF", category: "procedure", is_active: true, display_order: 5 },
  { id: "f7", status_code: "implant", label: "Implante", color: "#10B981", border_color: "#10B981", category: "procedure", is_active: true, display_order: 6 },
  { id: "f8", status_code: "crown", label: "Coroa", color: "#F59E0B", border_color: "#F59E0B", category: "procedure", is_active: true, display_order: 7 },
  { id: "f9", status_code: "bridge", label: "Ponte", color: "#8B5CF6", border_color: "#8B5CF6", category: "procedure", is_active: true, display_order: 8 },
  { id: "f10", status_code: "root_canal", label: "Canal", color: "#F97316", border_color: "#F97316", category: "procedure", is_active: true, display_order: 9 },
]

// ─── Exported helpers for backward compatibility ────────────────────

export function getLegendColorMap(items: OdontogramLegendItem[]): Record<string, string> {
  const map: Record<string, string> = {}
  for (const item of items) {
    map[item.status_code] = item.color
  }
  return map
}

export function getLegendBorderMap(items: OdontogramLegendItem[]): Record<string, string> {
  const map: Record<string, string> = {}
  for (const item of items) {
    map[item.status_code] = item.border_color
  }
  return map
}

export { FALLBACK_STATUSES }

// ─── Component ──────────────────────────────────────────────────────

interface ToothLegendProps {
  items?: OdontogramLegendItem[]
}

export function ToothLegend({ items }: ToothLegendProps) {
  const t = useTranslations("odontogram")
  const legendItems = items && items.length > 0 ? items : FALLBACK_STATUSES
  const activeItems = legendItems.filter((item) => item.is_active)

  const findings = activeItems.filter((item) => item.category === "finding")
  const procedures = activeItems.filter((item) => item.category === "procedure")
  const general = activeItems.filter((item) => item.category === "general")

  function renderGroup(groupItems: OdontogramLegendItem[], title: string) {
    if (groupItems.length === 0) return null
    return (
      <div className="space-y-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <div className="flex flex-wrap gap-3">
          {groupItems.map((item) => (
            <div key={item.status_code} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm border"
                style={{
                  backgroundColor: item.color,
                  borderColor: item.border_color,
                }}
              />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2 text-xs">
      <span className="text-sm font-medium">{t("legend")}</span>
      {renderGroup(general, t("general"))}
      {renderGroup(findings, t("findings"))}
      {renderGroup(procedures, t("procedures"))}
    </div>
  )
}
