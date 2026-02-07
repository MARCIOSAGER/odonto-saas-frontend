"use client"

import { useState, useEffect } from 'react'
import { ZONE_DEFS, PROCEDURE_OPTIONS, PROCEDURE_NAMES, PROCEDURE_ICONS } from '@/lib/hof/zone-definitions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { X } from 'lucide-react'
import type { ProcedureSidebarProps, ProcedureData } from './types'

export function ProcedureSidebar({
  selectedZone,
  zones,
  procedures,
  onSave,
  onRemove,
  onCancel
}: ProcedureSidebarProps) {
  const [formData, setFormData] = useState<Partial<ProcedureData>>({
    type: '',
    product: '',
    dosage: '',
    lot: '',
    cost: 0,
    intensity: 70,
    notes: ''
  })

  // Load existing procedure data when zone is selected
  useEffect(() => {
    if (selectedZone && procedures[selectedZone]) {
      setFormData(procedures[selectedZone])
    } else {
      setFormData({
        type: '',
        product: '',
        dosage: '',
        lot: '',
        cost: 0,
        intensity: 70,
        notes: ''
      })
    }
  }, [selectedZone, procedures])

  const zone = selectedZone ? ZONE_DEFS.find(z => z.id === selectedZone) : null
  const procList = Object.values(procedures)
  const totalCost = procList.reduce((sum, p) => sum + (p.cost || 0), 0)

  const handleSave = () => {
    if (!formData.type || !selectedZone) return
    onSave({
      ...formData,
      zone: selectedZone,
      zoneName: zone?.name || '',
      typeName: PROCEDURE_NAMES[formData.type] || formData.type
    })
  }

  return (
    <div className="w-[270px] bg-slate-800 overflow-y-auto p-2.5 border-l border-slate-700">
      <h3 className="text-sm font-semibold text-slate-200 mb-0.5">
        {selectedZone ? zone?.name : 'Procedimentos HOF'}
      </h3>
      <p className="text-[9px] text-slate-500 mb-2.5">
        {selectedZone
          ? 'Registrar procedimento'
          : procList.length > 0
            ? `${procList.length} procedimento(s) registrado(s)`
            : 'Selecione uma zona para registrar'
        }
      </p>

      {/* Procedure Form */}
      {selectedZone && (
        <div className="flex flex-col gap-1.5">
          <div>
            <Label className="text-[9px] text-slate-400 uppercase tracking-wide">
              Zona Selecionada
            </Label>
            <Input
              value={zone?.name || ''}
              readOnly
              className="h-7 text-xs font-semibold text-teal-400 bg-slate-900 border-slate-700"
            />
          </div>

          <div>
            <Label className="text-[9px] text-slate-400 uppercase tracking-wide">
              Procedimento
            </Label>
            <Select
              value={formData.type || ''}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="h-7 text-xs bg-slate-900 border-slate-700">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {PROCEDURE_OPTIONS.map(group => (
                  <SelectGroup key={group.label}>
                    <SelectLabel>{group.label}</SelectLabel>
                    {group.options.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-[9px] text-slate-400 uppercase tracking-wide">
              Produto / Marca
            </Label>
            <Input
              value={formData.product || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, product: e.target.value }))}
              placeholder="Ex: Juvederm Voluma, Botox 100U..."
              className="h-7 text-xs bg-slate-900 border-slate-700"
            />
          </div>

          <div>
            <Label className="text-[9px] text-slate-400 uppercase tracking-wide">
              Dosagem / Volume
            </Label>
            <Input
              value={formData.dosage || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
              placeholder="Ex: 20U, 1ml, 2 fios..."
              className="h-7 text-xs bg-slate-900 border-slate-700"
            />
          </div>

          <div>
            <Label className="text-[9px] text-slate-400 uppercase tracking-wide">
              Lote / Validade
            </Label>
            <Input
              value={formData.lot || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, lot: e.target.value }))}
              placeholder="Ex: LOT123 - Val: 12/2026"
              className="h-7 text-xs bg-slate-900 border-slate-700"
            />
          </div>

          <div>
            <Label className="text-[9px] text-slate-400 uppercase tracking-wide">
              Custo (R$)
            </Label>
            <Input
              type="number"
              value={formData.cost || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
              placeholder="0.00"
              step="0.01"
              className="h-7 text-xs bg-slate-900 border-slate-700"
            />
          </div>

          <div>
            <Label className="text-[9px] text-slate-400 uppercase tracking-wide">
              Intensidade da Simulacao
            </Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[formData.intensity || 70]}
                onValueChange={([value]) => setFormData(prev => ({ ...prev, intensity: value }))}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-cyan-400 min-w-[32px] text-right">
                {formData.intensity || 70}%
              </span>
            </div>
          </div>

          <div>
            <Label className="text-[9px] text-slate-400 uppercase tracking-wide">
              Observacoes
            </Label>
            <Textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notas clinicas..."
              className="h-12 text-xs bg-slate-900 border-slate-700 resize-y"
            />
          </div>

          <div className="flex gap-1.5 mt-1.5">
            <Button
              onClick={handleSave}
              disabled={!formData.type}
              className="flex-1 h-7 text-xs bg-teal-600 hover:bg-teal-700"
            >
              Salvar Procedimento
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              className="h-7 text-xs border-slate-600"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Procedure List */}
      {!selectedZone && (
        <div className="space-y-1.5">
          {procList.length === 0 ? (
            <p className="text-[10px] text-slate-500 text-center py-8">
              Nenhum procedimento registrado.<br />
              Clique em uma zona do faceograma.
            </p>
          ) : (
            procList.map(proc => {
              const zoneDef = ZONE_DEFS.find(z => z.id === proc.zone)
              return (
                <div
                  key={proc.zone}
                  className="bg-slate-900 rounded-md p-2 border-l-[3px]"
                  style={{ borderLeftColor: zoneDef?.color || '#3b82f6' }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-200">
                      {proc.zoneName}
                    </span>
                    <span className="text-[9px] text-cyan-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {proc.typeName}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-relaxed">
                    {proc.product && <><b>Produto:</b> {proc.product}<br /></>}
                    {proc.dosage && <><b>Dosagem:</b> {proc.dosage}<br /></>}
                    {proc.cost > 0 && <><b>Custo:</b> R$ {proc.cost.toFixed(2)}<br /></>}
                    <b>Intensidade:</b> {proc.intensity}%
                  </div>
                  <button
                    className="text-[9px] text-red-400 mt-1 opacity-70 hover:opacity-100"
                    onClick={() => onRemove(proc.zone)}
                  >
                    Remover
                  </button>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Total Bar */}
      {procList.length > 0 && !selectedZone && (
        <div className="bg-teal-600 text-white p-2 rounded-md text-center mt-2">
          <b className="text-sm">R$ {totalCost.toFixed(2)}</b>
          <br />
          <span className="text-xs">{procList.length} procedimento(s)</span>
        </div>
      )}
    </div>
  )
}

export default ProcedureSidebar
