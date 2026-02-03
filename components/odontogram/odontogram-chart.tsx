"use client"
import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { ToothLegend, FALLBACK_STATUSES, getLegendColorMap, getLegendBorderMap } from "./tooth-legend"
import type {
  OdontogramLegendItem,
  OdontogramEntry,
  OdontogramTooth,
  DentitionType,
} from "@/hooks/useOdontogram"

// ─── FDI Tooth Numbering ────────────────────────────────────────────

// Permanent dentition (adults)
const PERM_UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11]
const PERM_UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28]
const PERM_LOWER_LEFT = [31, 32, 33, 34, 35, 36, 37, 38]
const PERM_LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41]

// Deciduous dentition (children)
const DECID_UPPER_RIGHT = [55, 54, 53, 52, 51]
const DECID_UPPER_LEFT = [61, 62, 63, 64, 65]
const DECID_LOWER_LEFT = [71, 72, 73, 74, 75]
const DECID_LOWER_RIGHT = [85, 84, 83, 82, 81]

function getQuadrants(dentitionType: DentitionType) {
  if (dentitionType === "DECIDUOUS") {
    return {
      upperRight: DECID_UPPER_RIGHT,
      upperLeft: DECID_UPPER_LEFT,
      lowerLeft: DECID_LOWER_LEFT,
      lowerRight: DECID_LOWER_RIGHT,
    }
  }
  if (dentitionType === "MIXED") {
    // Mixed: show permanent teeth with deciduous interspersed
    // For simplicity, show permanent full arch + deciduous full arch below
    return {
      upperRight: PERM_UPPER_RIGHT,
      upperLeft: PERM_UPPER_LEFT,
      lowerLeft: PERM_LOWER_LEFT,
      lowerRight: PERM_LOWER_RIGHT,
      decidUpperRight: DECID_UPPER_RIGHT,
      decidUpperLeft: DECID_UPPER_LEFT,
      decidLowerLeft: DECID_LOWER_LEFT,
      decidLowerRight: DECID_LOWER_RIGHT,
    }
  }
  // PERMANENT (default)
  return {
    upperRight: PERM_UPPER_RIGHT,
    upperLeft: PERM_UPPER_LEFT,
    lowerLeft: PERM_LOWER_LEFT,
    lowerRight: PERM_LOWER_RIGHT,
  }
}

// ─── Interfaces ─────────────────────────────────────────────────────

interface OdontogramChartProps {
  teeth: OdontogramTooth[]
  legend?: OdontogramLegendItem[]
  dentitionType?: DentitionType
  onToothClick?: (toothNumber: number) => void
  selectedTooth?: number | null
  readOnly?: boolean
}

// ─── ToothSvg ───────────────────────────────────────────────────────

function ToothSvg({
  number,
  fill,
  stroke,
  selected,
  onClick,
  isUpper,
  isDeciduous,
}: {
  number: number
  fill: string
  stroke: string
  selected: boolean
  onClick: () => void
  isUpper: boolean
  isDeciduous: boolean
  hasExtraction?: boolean
  hasMissing?: boolean
}) {
  const w = isDeciduous ? 22 : 28
  const h = isDeciduous ? 28 : 36
  const rootLen = isDeciduous ? 6 : 8
  const fontSize = isDeciduous ? 8 : 9

  return (
    <g onClick={onClick} className="cursor-pointer" role="button" tabIndex={0}>
      {/* Tooth body */}
      <rect
        width={w}
        height={h}
        rx="4"
        fill={fill}
        stroke={selected ? "#0EA5E9" : stroke}
        strokeWidth={selected ? 2.5 : 1.5}
      />
      {/* Root indicator */}
      {isUpper ? (
        <line
          x1={w / 2}
          y1={h}
          x2={w / 2}
          y2={h + rootLen}
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ) : (
        <line
          x1={w / 2}
          y1={-rootLen}
          x2={w / 2}
          y2={0}
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
      {/* Number label */}
      <text
        x={w / 2}
        y={isUpper ? h + rootLen + 12 : -(rootLen + 6)}
        textAnchor="middle"
        fontSize={fontSize}
        fill="currentColor"
        className="select-none text-muted-foreground"
      >
        {number}
      </text>
    </g>
  )
}

// ─── Main Chart ─────────────────────────────────────────────────────

export function OdontogramChart({
  teeth,
  legend,
  dentitionType = "PERMANENT",
  onToothClick,
  selectedTooth,
  readOnly = false,
}: OdontogramChartProps) {
  const t = useTranslations("odontogram")

  const legendItems = legend && legend.length > 0 ? legend : FALLBACK_STATUSES
  const colorMap = useMemo(() => getLegendColorMap(legendItems), [legendItems])
  const borderMap = useMemo(() => getLegendBorderMap(legendItems), [legendItems])

  // Build a map of tooth_number -> latest active entry
  const teethMap = useMemo(() => {
    const map = new Map<number, OdontogramTooth>()
    for (const tooth of teeth) {
      map.set(tooth.tooth_number, tooth)
    }
    return map
  }, [teeth])

  // Get display color for a tooth based on its latest active entry
  function getToothColors(toothNum: number): { fill: string; stroke: string } {
    const tooth = teethMap.get(toothNum)
    if (!tooth || !tooth.entries || tooth.entries.length === 0) {
      return {
        fill: colorMap["healthy"] || "#FFFFFF",
        stroke: borderMap["healthy"] || "#D1D5DB",
      }
    }

    // Get the latest active entry
    const activeEntries = tooth.entries.filter((e) => e.is_active)
    if (activeEntries.length === 0) {
      return {
        fill: colorMap["healthy"] || "#FFFFFF",
        stroke: borderMap["healthy"] || "#D1D5DB",
      }
    }

    // Use the most recent active entry for color
    const latestEntry = activeEntries.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]

    return {
      fill: colorMap[latestEntry.status_code] || colorMap["healthy"] || "#FFFFFF",
      stroke:
        borderMap[latestEntry.status_code] || borderMap["healthy"] || "#D1D5DB",
    }
  }

  function isDeciduousTooth(num: number): boolean {
    return num >= 51 && num <= 85
  }

  function isUpperTooth(num: number): boolean {
    if (num >= 11 && num <= 28) return true
    if (num >= 51 && num <= 65) return true
    return false
  }

  const quadrants = getQuadrants(dentitionType)
  const isMixed = dentitionType === "MIXED"

  // Spacing constants
  const permToothW = 28
  const permSpacing = 33
  const decidToothW = 22
  const decidSpacing = 27

  // Compute viewBox based on dentition
  const permTeethPerArch = 16
  const decidTeethPerArch = 10
  const permArchWidth = permTeethPerArch * permSpacing + 12 // +12 for center gap
  const decidArchWidth = decidTeethPerArch * decidSpacing + 12

  let svgWidth: number
  let svgHeight: number

  if (isMixed) {
    svgWidth = Math.max(permArchWidth, decidArchWidth) + 20
    svgHeight = 350
  } else if (dentitionType === "DECIDUOUS") {
    svgWidth = decidArchWidth + 20
    svgHeight = 180
  } else {
    svgWidth = permArchWidth + 20
    svgHeight = 180
  }

  function renderArch(
    rightTeeth: number[],
    leftTeeth: number[],
    yOffset: number,
    isDecid: boolean,
    archLabel?: string
  ) {
    const spacing = isDecid ? decidSpacing : permSpacing
    const totalTeeth = rightTeeth.length + leftTeeth.length
    const gapSize = 12
    const archWidth = totalTeeth * spacing + gapSize

    // Center the arch within svgWidth
    const xStart = (svgWidth - archWidth) / 2

    return (
      <g>
        {archLabel && (
          <text
            x={svgWidth / 2}
            y={yOffset - 22}
            textAnchor="middle"
            fontSize="10"
            fill="currentColor"
            className="text-muted-foreground font-medium select-none"
          >
            {archLabel}
          </text>
        )}
        {/* Right quadrant */}
        {rightTeeth.map((num, i) => {
          const { fill, stroke } = getToothColors(num)
          const isUpper = isUpperTooth(num)
          return (
            <g key={num} transform={`translate(${xStart + i * spacing}, ${yOffset})`}>
              <ToothSvg
                number={num}
                fill={fill}
                stroke={stroke}
                selected={selectedTooth === num}
                onClick={() => onToothClick?.(num)}
                isUpper={isUpper}
                isDeciduous={isDecid}
              />
            </g>
          )
        })}
        {/* Left quadrant */}
        {leftTeeth.map((num, i) => {
          const { fill, stroke } = getToothColors(num)
          const isUpper = isUpperTooth(num)
          return (
            <g
              key={num}
              transform={`translate(${xStart + (i + rightTeeth.length) * spacing + gapSize}, ${yOffset})`}
            >
              <ToothSvg
                number={num}
                fill={fill}
                stroke={stroke}
                selected={selectedTooth === num}
                onClick={() => onToothClick?.(num)}
                isUpper={isUpper}
                isDeciduous={isDecid}
              />
            </g>
          )
        })}

        {/* Center divider line */}
        <line
          x1={xStart + rightTeeth.length * spacing + gapSize / 2}
          y1={yOffset - 15}
          x2={xStart + rightTeeth.length * spacing + gapSize / 2}
          y2={yOffset + (isDecid ? 50 : 60)}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.2"
          strokeDasharray="4,4"
        />
      </g>
    )
  }

  return (
    <div className="space-y-6">
      {/* SVG Chart */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full min-w-[500px] max-w-4xl mx-auto"
          style={{ height: "auto" }}
        >
          {dentitionType === "PERMANENT" && (
            <>
              {/* Upper permanent arch */}
              {renderArch(quadrants.upperRight, quadrants.upperLeft, 20, false)}
              {/* Horizontal divider between arches */}
              <line
                x1={10}
                y1={svgHeight / 2 + 5}
                x2={svgWidth - 10}
                y2={svgHeight / 2 + 5}
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.2"
                strokeDasharray="4,4"
              />
              {/* Lower permanent arch */}
              {renderArch(quadrants.lowerLeft, quadrants.lowerRight, 100, false)}
            </>
          )}

          {dentitionType === "DECIDUOUS" && (
            <>
              {/* Upper deciduous arch */}
              {renderArch(quadrants.upperRight, quadrants.upperLeft, 20, true)}
              {/* Horizontal divider */}
              <line
                x1={10}
                y1={svgHeight / 2 + 5}
                x2={svgWidth - 10}
                y2={svgHeight / 2 + 5}
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.2"
                strokeDasharray="4,4"
              />
              {/* Lower deciduous arch */}
              {renderArch(quadrants.lowerLeft, quadrants.lowerRight, 100, true)}
            </>
          )}

          {dentitionType === "MIXED" && (
            <>
              {/* Permanent teeth section */}
              {renderArch(
                quadrants.upperRight,
                quadrants.upperLeft,
                20,
                false,
                t("permanentDentition")
              )}
              <line
                x1={10}
                y1={95}
                x2={svgWidth - 10}
                y2={95}
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.2"
                strokeDasharray="4,4"
              />
              {renderArch(quadrants.lowerLeft, quadrants.lowerRight, 110, false)}

              {/* Divider between permanent and deciduous */}
              <line
                x1={10}
                y1={195}
                x2={svgWidth - 10}
                y2={195}
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.15"
              />

              {/* Deciduous teeth section */}
              {"decidUpperRight" in quadrants && (
                <>
                  {renderArch(
                    (quadrants as any).decidUpperRight,
                    (quadrants as any).decidUpperLeft,
                    210,
                    true,
                    t("deciduousDentition")
                  )}
                  <line
                    x1={10}
                    y1={280}
                    x2={svgWidth - 10}
                    y2={280}
                    stroke="currentColor"
                    strokeWidth="0.5"
                    opacity="0.2"
                    strokeDasharray="4,4"
                  />
                  {renderArch(
                    (quadrants as any).decidLowerLeft,
                    (quadrants as any).decidLowerRight,
                    295,
                    true
                  )}
                </>
              )}
            </>
          )}
        </svg>
      </div>

      {/* Legend */}
      <ToothLegend items={legendItems} />
    </div>
  )
}
