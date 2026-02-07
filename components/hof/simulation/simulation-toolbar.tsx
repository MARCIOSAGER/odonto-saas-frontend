"use client"

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import {
  Layers,
  CircleDot,
  Move,
  Wand2,
  Split,
  Download,
  Upload
} from 'lucide-react'
import type { SimulationToolbarProps } from './types'

export function SimulationToolbar({
  photoLoaded,
  overlayVisible,
  showLandmarks,
  repositionMode,
  sculptMode,
  beforeAfterMode,
  overlayOpacity,
  zoom,
  onToggleOverlay,
  onToggleLandmarks,
  onToggleReposition,
  onToggleSculpt,
  onToggleBeforeAfter,
  onOpacityChange,
  onZoomChange,
  onUpload,
  onExport
}: SimulationToolbarProps) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-800 border-b border-slate-700 flex-wrap min-h-[36px]">
      {/* Overlay toggle */}
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-7 px-2 text-[10px] border-slate-600",
          overlayVisible && "bg-teal-600 text-white border-teal-600"
        )}
        onClick={onToggleOverlay}
      >
        <Layers size={12} className="mr-1" />
        Overlay
      </Button>

      {/* Landmarks toggle */}
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-7 px-2 text-[10px] border-slate-600",
          showLandmarks && "bg-teal-600 text-white border-teal-600"
        )}
        onClick={onToggleLandmarks}
      >
        <CircleDot size={12} className="mr-1" />
        Landmarks
      </Button>

      <div className="w-px h-5 bg-slate-700 mx-0.5" />

      {/* Reposition toggle */}
      {photoLoaded && (
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-7 px-2 text-[10px] border-slate-600",
            repositionMode && "bg-amber-500 text-black border-amber-500 font-bold animate-pulse"
          )}
          onClick={onToggleReposition}
        >
          <Move size={12} className="mr-1" />
          {repositionMode ? 'Concluir Reposicao' : 'Reposicionar'}
        </Button>
      )}

      {/* Sculpt toggle */}
      {photoLoaded && (
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-7 px-2 text-[10px] border-slate-600",
            sculptMode && "bg-indigo-600 text-white border-indigo-600"
          )}
          onClick={onToggleSculpt}
        >
          <Wand2 size={12} className="mr-1" />
          Esculpir
        </Button>
      )}

      <div className="w-px h-5 bg-slate-700 mx-0.5" />

      {/* Before/After toggle */}
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-7 px-2 text-[10px] border-slate-600",
          beforeAfterMode && "bg-teal-600 text-white border-teal-600"
        )}
        onClick={onToggleBeforeAfter}
      >
        <Split size={12} className="mr-1" />
        Antes/Depois
      </Button>

      {/* Export */}
      <Button
        variant="outline"
        size="sm"
        className="h-7 px-2 text-[10px] border-slate-600"
        onClick={onExport}
        disabled={!photoLoaded}
      >
        <Download size={12} className="mr-1" />
        Exportar
      </Button>

      <div className="w-px h-5 bg-slate-700 mx-0.5" />

      {/* Opacity slider */}
      {photoLoaded && (
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-slate-400 whitespace-nowrap">Opacidade</span>
          <Slider
            value={[overlayOpacity]}
            onValueChange={([value]) => onOpacityChange(value)}
            min={0}
            max={100}
            step={1}
            className="w-[60px]"
          />
          <span className="text-[9px] text-cyan-400 min-w-[28px]">
            {overlayOpacity}%
          </span>
        </div>
      )}

      {/* Zoom slider */}
      {photoLoaded && (
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-slate-400 whitespace-nowrap">Zoom</span>
          <Slider
            value={[zoom]}
            onValueChange={([value]) => onZoomChange(value)}
            min={50}
            max={200}
            step={5}
            className="w-[60px]"
          />
          <span className="text-[9px] text-cyan-400 min-w-[28px]">
            {zoom}%
          </span>
        </div>
      )}

      {/* Upload button */}
      <Button
        variant="outline"
        size="sm"
        className="h-7 px-2 text-[10px] border-slate-600 ml-auto"
        onClick={onUpload}
      >
        <Upload size={12} className="mr-1" />
        Upload Foto
      </Button>
    </div>
  )
}

export default SimulationToolbar
