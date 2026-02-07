"use client"

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { Undo2, RotateCcw, Check } from 'lucide-react'
import type { SculptToolbarProps } from './types'
import type { SculptTool } from '@/lib/hof/sculpt-engine'

const SCULPT_TOOLS: { id: SculptTool; label: string }[] = [
  { id: 'push', label: 'Puxar' },
  { id: 'inflate', label: 'Inflar' },
  { id: 'deflate', label: 'Contrair' },
  { id: 'smooth', label: 'Alisar' }
]

export function SculptToolbar({
  isActive,
  tool,
  brushSize,
  strength,
  canUndo,
  onToolChange,
  onBrushSizeChange,
  onStrengthChange,
  onUndo,
  onReset,
  onDone
}: SculptToolbarProps) {
  if (!isActive) return null

  return (
    <div className="flex items-center gap-1.5 px-2 py-1.5 bg-gradient-to-r from-indigo-900 to-purple-900 border-b border-indigo-600 flex-wrap min-h-[36px]">
      <span className="text-[10px] text-indigo-300 font-semibold">
        Ferramentas:
      </span>

      {/* Tool buttons */}
      {SCULPT_TOOLS.map(t => (
        <Button
          key={t.id}
          variant="outline"
          size="sm"
          className={cn(
            "h-7 px-2 text-[10px] border-indigo-500 text-indigo-200",
            tool === t.id && "bg-indigo-600 text-white border-indigo-400 font-semibold"
          )}
          onClick={() => onToolChange(t.id)}
        >
          {t.label}
        </Button>
      ))}

      <div className="w-px h-5 bg-indigo-600 mx-1" />

      {/* Brush size slider */}
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] text-indigo-300 whitespace-nowrap">Pincel</span>
        <Slider
          value={[brushSize]}
          onValueChange={([value]) => onBrushSizeChange(value)}
          min={10}
          max={120}
          step={5}
          className="w-[70px]"
        />
        <span className="text-[9px] text-indigo-200 min-w-[28px]">
          {brushSize}px
        </span>
      </div>

      {/* Strength slider */}
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] text-indigo-300 whitespace-nowrap">Forca</span>
        <Slider
          value={[strength]}
          onValueChange={([value]) => onStrengthChange(value)}
          min={1}
          max={100}
          step={1}
          className="w-[70px]"
        />
        <span className="text-[9px] text-indigo-200 min-w-[28px]">
          {strength}%
        </span>
      </div>

      <div className="w-px h-5 bg-indigo-600 mx-1" />

      {/* Undo */}
      <Button
        variant="outline"
        size="sm"
        className="h-7 px-2 text-[10px] border-indigo-500 text-indigo-200"
        onClick={onUndo}
        disabled={!canUndo}
      >
        <Undo2 size={12} className="mr-1" />
        Desfazer
      </Button>

      {/* Reset */}
      <Button
        variant="outline"
        size="sm"
        className="h-7 px-2 text-[10px] border-indigo-500 text-indigo-200"
        onClick={onReset}
      >
        <RotateCcw size={12} className="mr-1" />
        Resetar
      </Button>

      {/* Done */}
      <Button
        size="sm"
        className="h-7 px-3 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white"
        onClick={onDone}
      >
        <Check size={12} className="mr-1" />
        Concluir
      </Button>
    </div>
  )
}

export default SculptToolbar
