const statuses = [
  { key: "healthy", label: "Saudável", color: "#FFFFFF", border: "#D1D5DB" },
  { key: "cavity", label: "Cárie", color: "#EF4444", border: "#EF4444" },
  { key: "restoration", label: "Restauração", color: "#3B82F6", border: "#3B82F6" },
  { key: "extraction", label: "Extração", color: "#9CA3AF", border: "#9CA3AF" },
  { key: "implant", label: "Implante", color: "#10B981", border: "#10B981" },
  { key: "crown", label: "Coroa", color: "#F59E0B", border: "#F59E0B" },
  { key: "bridge", label: "Ponte", color: "#8B5CF6", border: "#8B5CF6" },
  { key: "root_canal", label: "Canal", color: "#F97316", border: "#F97316" },
  { key: "fracture", label: "Fratura", color: "#EC4899", border: "#EC4899" },
  { key: "missing", label: "Ausente", color: "#E5E7EB", border: "#9CA3AF" },
]

export function ToothLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs">
      {statuses.map((s) => (
        <div key={s.key} className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-sm border"
            style={{ backgroundColor: s.color, borderColor: s.border }}
          />
          <span className="text-muted-foreground">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

export const STATUS_COLORS: Record<string, string> = Object.fromEntries(
  statuses.map((s) => [s.key, s.color])
)

export const STATUS_BORDERS: Record<string, string> = Object.fromEntries(
  statuses.map((s) => [s.key, s.border])
)

export const STATUS_OPTIONS = statuses
