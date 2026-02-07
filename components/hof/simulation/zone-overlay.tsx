"use client"

import { useRef, useState, useCallback, useEffect } from 'react'
import { ZONE_DEFS, PROCEDURE_ICONS } from '@/lib/hof/zone-definitions'
import type { ZoneOverlayProps, DragState } from './types'

export function ZoneOverlay({
  zones,
  selectedZone,
  visibleZones,
  procedures,
  repositionMode,
  canvasWidth,
  canvasHeight,
  overlayOpacity,
  onZoneClick,
  onZoneDrag,
  onZoneResize
}: ZoneOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)

  // Handle drag start
  const handleDragStart = useCallback((
    e: React.MouseEvent | React.TouchEvent,
    zoneId: string,
    type: 'move' | 'resize'
  ) => {
    if (!repositionMode) return
    e.preventDefault()
    e.stopPropagation()

    const svgRect = svgRef.current?.getBoundingClientRect()
    if (!svgRect) return

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    const zone = zones[zoneId]
    if (!zone) return

    setDragState({
      type,
      zoneId,
      startClientX: clientX,
      startClientY: clientY,
      origCx: zone.simRegion.cx,
      origCy: zone.simRegion.cy,
      origRx: zone.simRegion.rx,
      origRy: zone.simRegion.ry,
      scaleX: 1 / svgRect.width,
      scaleY: 1 / svgRect.height
    })
  }, [repositionMode, zones])

  // Handle drag move
  useEffect(() => {
    if (!dragState) return

    const handleMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

      const dx = (clientX - dragState.startClientX) * dragState.scaleX
      const dy = (clientY - dragState.startClientY) * dragState.scaleY

      if (dragState.type === 'move') {
        onZoneDrag(dragState.zoneId, dx, dy)
      } else {
        onZoneResize(dragState.zoneId, dx, dy)
      }
    }

    const handleEnd = () => {
      setDragState(null)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleMove, { passive: false })
    document.addEventListener('touchend', handleEnd)

    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [dragState, onZoneDrag, onZoneResize])

  // Handle mouse move for tooltip
  const handleMouseMove = useCallback((e: React.MouseEvent, zoneId: string) => {
    if (repositionMode) return

    const zone = zones[zoneId]
    const zoneDef = ZONE_DEFS.find(z => z.id === zoneId)
    const proc = procedures[zoneId]

    if (zone && zoneDef) {
      const text = proc
        ? `${zoneDef.name} ✓ ${proc.typeName}`
        : zoneDef.name

      setTooltip({
        text,
        x: e.clientX + 12,
        y: e.clientY - 20
      })
    }
  }, [repositionMode, zones, procedures])

  const handleMouseLeave = useCallback(() => {
    setTooltip(null)
  }, [])

  if (canvasWidth === 0 || canvasHeight === 0) return null

  return (
    <>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: overlayOpacity / 100,
          pointerEvents: repositionMode ? 'auto' : 'auto'
        }}
      >
        {Object.entries(zones).map(([id, zone]) => {
          const zoneDef = ZONE_DEFS.find(z => z.id === id)
          if (!zoneDef) return null

          const hasProc = !!procedures[id]
          const isSelected = id === selectedZone
          const isVisible = visibleZones.has(id)

          // Filter visibility: show if repositioning, has procedure, selected, or explicitly visible
          if (!repositionMode && !hasProc && !isSelected && !isVisible) {
            return null
          }

          const r = zone.simRegion
          const cx = r.cx * canvasWidth
          const cy = r.cy * canvasHeight
          const rx = r.rx * canvasWidth
          const ry = r.ry * canvasHeight

          return (
            <g
              key={id}
              className={repositionMode ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
              onMouseMove={(e) => handleMouseMove(e, id)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Zone ellipse */}
              <ellipse
                cx={cx}
                cy={cy}
                rx={rx}
                ry={ry}
                fill={zoneDef.color + (hasProc ? '55' : '22')}
                stroke={zoneDef.color}
                strokeWidth={isSelected ? 2.5 : hasProc ? 2 : 1}
                strokeDasharray={!hasProc && !isSelected ? '4,3' : undefined}
                onClick={(e) => {
                  if (!repositionMode) {
                    e.stopPropagation()
                    onZoneClick(id)
                  }
                }}
                onMouseDown={(e) => handleDragStart(e, id, 'move')}
                onTouchStart={(e) => handleDragStart(e, id, 'move')}
              />

              {/* Procedure icon */}
              {hasProc && (
                <text
                  x={cx}
                  y={cy + 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={Math.max(10, Math.min(rx, ry) * 0.8)}
                  pointerEvents="none"
                >
                  {PROCEDURE_ICONS[procedures[id].type] || '✓'}
                </text>
              )}

              {/* Resize handle (reposition mode only) */}
              {repositionMode && (
                <>
                  <rect
                    x={cx + rx - 3}
                    y={cy + ry - 3}
                    width={6}
                    height={6}
                    fill="white"
                    stroke={zoneDef.color}
                    strokeWidth={1.5}
                    rx={1}
                    className="cursor-nwse-resize opacity-70 hover:opacity-100"
                    onMouseDown={(e) => handleDragStart(e, id, 'resize')}
                    onTouchStart={(e) => handleDragStart(e, id, 'resize')}
                  />
                  <text
                    x={cx}
                    y={cy - ry - 4}
                    textAnchor="middle"
                    fill={zoneDef.color}
                    fontSize={9}
                    fontWeight={600}
                    pointerEvents="none"
                  >
                    {zoneDef.name}
                  </text>
                </>
              )}
            </g>
          )
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed bg-slate-800 text-slate-200 px-2.5 py-1 rounded text-[10px] pointer-events-none z-50 border border-slate-600 shadow-lg"
          style={{
            left: tooltip.x,
            top: tooltip.y
          }}
        >
          {tooltip.text}
        </div>
      )}
    </>
  )
}

export default ZoneOverlay
