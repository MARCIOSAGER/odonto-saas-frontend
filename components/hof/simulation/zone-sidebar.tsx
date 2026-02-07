"use client"

import { ZONE_DEFS, getZonesByTercio } from '@/lib/hof/zone-definitions'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'
import type { ZoneSidebarProps } from './types'

export function ZoneSidebar({
  selectedZone,
  visibleZones,
  showAllZones,
  procedures,
  currentGender,
  onSelectZone,
  onToggleVisibility,
  onToggleShowAll,
  onSwitchGender
}: ZoneSidebarProps) {
  const zonesByTercio = getZonesByTercio()

  return (
    <div className="w-[210px] bg-slate-800 overflow-y-auto p-1.5 border-r border-slate-700">
      {/* Gender selector */}
      <div className="flex gap-1 mb-1.5">
        <button
          className={cn(
            "flex-1 py-1 px-2 border rounded text-xs transition-colors",
            currentGender === 'F'
              ? "bg-teal-600 text-white border-teal-600"
              : "bg-transparent text-slate-400 border-slate-600 hover:bg-slate-700"
          )}
          onClick={() => onSwitchGender('F')}
        >
          Feminino
        </button>
        <button
          className={cn(
            "flex-1 py-1 px-2 border rounded text-xs transition-colors",
            currentGender === 'M'
              ? "bg-teal-600 text-white border-teal-600"
              : "bg-transparent text-slate-400 border-slate-600 hover:bg-slate-700"
          )}
          onClick={() => onSwitchGender('M')}
        >
          Masculino
        </button>
      </div>

      {/* Show all zones toggle */}
      <button
        className={cn(
          "w-full py-1.5 mb-1.5 border rounded text-[9px] text-center transition-colors",
          showAllZones
            ? "bg-teal-600 text-white border-teal-600"
            : "bg-transparent text-slate-400 border-slate-600 hover:bg-slate-700"
        )}
        onClick={onToggleShowAll}
      >
        {showAllZones ? 'Ocultar Todas as Zonas' : 'Mostrar Todas as Zonas'}
      </button>

      {/* Zone list by tercio */}
      {Object.entries(zonesByTercio).map(([tercio, zones]) => (
        <div key={tercio}>
          <h3 className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold mt-2.5 mb-0.5 ml-1">
            {tercio}
          </h3>
          {zones.map(zone => {
            const isSelected = selectedZone === zone.id
            const hasProc = !!procedures[zone.id]
            const isVisible = visibleZones.has(zone.id)

            return (
              <div
                key={zone.id}
                className={cn(
                  "flex items-center gap-1.5 py-0.5 px-1.5 rounded cursor-pointer text-[10.5px] transition-colors mb-px",
                  isSelected && "bg-teal-600 text-white font-semibold",
                  !isSelected && hasProc && "bg-slate-700/50 border-l-[3px] border-blue-500 pl-0.5",
                  !isSelected && !hasProc && "text-slate-300 hover:bg-slate-700"
                )}
              >
                <span
                  className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                  style={{ backgroundColor: zone.color }}
                  onClick={() => onSelectZone(zone.id)}
                />
                <span
                  className="flex-1"
                  onClick={() => onSelectZone(zone.id)}
                >
                  {zone.name}
                </span>
                <button
                  className={cn(
                    "ml-auto text-[10px] px-1 transition-opacity",
                    isVisible ? "opacity-80 text-teal-400" : "opacity-40"
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleVisibility(zone.id)
                  }}
                >
                  {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default ZoneSidebar
