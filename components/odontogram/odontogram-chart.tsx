"use client"
import { useState } from "react"
import { STATUS_COLORS, STATUS_BORDERS, STATUS_OPTIONS, ToothLegend } from "./tooth-legend"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
} from "@/components/ui/select"

interface Tooth {
  tooth_number: number
  status: string
  surfaces?: Record<string, string> | null
  notes?: string | null
}

interface OdontogramChartProps {
  teeth: Tooth[]
  onToothClick?: (toothNumber: number) => void
  onToothUpdate?: (toothNumber: number, status: string, notes?: string) => void
  readOnly?: boolean
}

// FDI notation: adult teeth
const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11]
const UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28]
const LOWER_LEFT = [31, 32, 33, 34, 35, 36, 37, 38]
const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41]

const QUADRANTS = [
  { label: "Superior Direito", teeth: UPPER_RIGHT },
  { label: "Superior Esquerdo", teeth: UPPER_LEFT },
  { label: "Inferior Esquerdo", teeth: LOWER_LEFT },
  { label: "Inferior Direito", teeth: LOWER_RIGHT },
]

function ToothSvg({
  number,
  status,
  selected,
  onClick,
}: {
  number: number
  status: string
  selected: boolean
  onClick: () => void
}) {
  const fill = STATUS_COLORS[status] || STATUS_COLORS.healthy
  const stroke = STATUS_BORDERS[status] || STATUS_BORDERS.healthy
  const isUpper = number >= 11 && number <= 28

  return (
    <g onClick={onClick} className="cursor-pointer" role="button" tabIndex={0}>
      {/* Tooth body */}
      <rect
        width="28"
        height="36"
        rx="4"
        fill={fill}
        stroke={selected ? "#0EA5E9" : stroke}
        strokeWidth={selected ? 2.5 : 1.5}
      />
      {/* Root indicator */}
      {isUpper ? (
        <line x1="14" y1="36" x2="14" y2="44" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <line x1="14" y1="-8" x2="14" y2="0" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      )}
      {/* Number label */}
      <text
        x="14"
        y={isUpper ? "56" : "-14"}
        textAnchor="middle"
        fontSize="9"
        fill="currentColor"
        className="select-none text-muted-foreground"
      >
        {number}
      </text>
      {/* Cross for extraction/missing */}
      {(status === "extraction" || status === "missing") && (
        <>
          <line x1="4" y1="4" x2="24" y2="32" stroke="#6B7280" strokeWidth="2" />
          <line x1="24" y1="4" x2="4" y2="32" stroke="#6B7280" strokeWidth="2" />
        </>
      )}
    </g>
  )
}

export function OdontogramChart({
  teeth,
  onToothClick,
  onToothUpdate,
  readOnly = false,
}: OdontogramChartProps) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [notes, setNotes] = useState("")

  const teethMap = new Map(teeth.map((t) => [t.tooth_number, t]))

  function handleToothClick(num: number) {
    const tooth = teethMap.get(num)
    setSelectedTooth(num)
    setSelectedStatus(tooth?.status || "healthy")
    setNotes(tooth?.notes || "")
    onToothClick?.(num)
  }

  function handleSave() {
    if (selectedTooth && onToothUpdate) {
      onToothUpdate(selectedTooth, selectedStatus, notes)
      setSelectedTooth(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* SVG Chart */}
      <div className="overflow-x-auto">
        <svg
          viewBox="-10 -30 550 180"
          className="w-full min-w-[550px] max-w-3xl mx-auto"
          style={{ height: "auto" }}
        >
          {/* Upper teeth */}
          {UPPER_RIGHT.map((num, i) => {
            const tooth = teethMap.get(num)
            return (
              <g key={num} transform={`translate(${i * 33}, 0)`}>
                <ToothSvg
                  number={num}
                  status={tooth?.status || "healthy"}
                  selected={selectedTooth === num}
                  onClick={() => handleToothClick(num)}
                />
              </g>
            )
          })}
          {UPPER_LEFT.map((num, i) => {
            const tooth = teethMap.get(num)
            return (
              <g key={num} transform={`translate(${(i + 8) * 33 + 12}, 0)`}>
                <ToothSvg
                  number={num}
                  status={tooth?.status || "healthy"}
                  selected={selectedTooth === num}
                  onClick={() => handleToothClick(num)}
                />
              </g>
            )
          })}

          {/* Lower teeth */}
          {LOWER_LEFT.map((num, i) => {
            const tooth = teethMap.get(num)
            return (
              <g key={num} transform={`translate(${i * 33}, 85)`}>
                <ToothSvg
                  number={num}
                  status={tooth?.status || "healthy"}
                  selected={selectedTooth === num}
                  onClick={() => handleToothClick(num)}
                />
              </g>
            )
          })}
          {LOWER_RIGHT.map((num, i) => {
            const tooth = teethMap.get(num)
            return (
              <g key={num} transform={`translate(${(i + 8) * 33 + 12}, 85)`}>
                <ToothSvg
                  number={num}
                  status={tooth?.status || "healthy"}
                  selected={selectedTooth === num}
                  onClick={() => handleToothClick(num)}
                />
              </g>
            )
          })}

          {/* Center divider */}
          <line x1="270" y1="-20" x2="270" y2="160" stroke="currentColor" strokeWidth="0.5" opacity="0.2" strokeDasharray="4,4" />
          <line x1="-5" y1="75" x2="545" y2="75" stroke="currentColor" strokeWidth="0.5" opacity="0.2" strokeDasharray="4,4" />
        </svg>
      </div>

      <ToothLegend />

      {/* Detail panel */}
      {selectedTooth && !readOnly && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Dente {selectedTooth}</h4>
              <button
                onClick={() => setSelectedTooth(null)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Fechar
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Observações</label>
                <input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: restauração em resina"
                  className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                />
              </div>
            </div>
            <Button size="sm" onClick={handleSave}>
              Salvar alteração
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
