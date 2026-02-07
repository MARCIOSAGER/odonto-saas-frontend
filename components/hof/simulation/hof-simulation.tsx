"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import { ZONE_DEFS, mapZoneToFacialRegion, mapProcedureToHofType, PROCEDURE_NAMES } from '@/lib/hof/zone-definitions'
import {
  initializeZones,
  alignZonesToLandmarks,
  resetZonesToDefaults,
  updateZonePosition as updateZonePos,
  updateZoneSize as updateZoneSz
} from '@/lib/hof/warp-strategies'
import { useFaceogram, useHofPhotos, type FacialRegion, type HofProcedureType } from '@/hooks/useHof'
import { toast } from 'sonner'
import { useMediaPipe } from '@/hooks/useMediaPipe'
import { useSculptEngine } from '@/hooks/useSculptEngine'
import { useMlsWarp } from '@/hooks/useMlsWarp'

import { ZoneSidebar } from './zone-sidebar'
import { ProcedureSidebar } from './procedure-sidebar'
import { SimulationToolbar } from './simulation-toolbar'
import { SculptToolbar } from './sculpt-toolbar'
import { ZoneOverlay } from './zone-overlay'

import type { ZoneState, ProcedureData } from './types'
import { Loader2, ImageOff } from 'lucide-react'

interface HofSimulationProps {
  patientId?: string
  onSaveToBackend?: (procedures: Record<string, ProcedureData>, imageData?: string) => Promise<void>
}

export function HofSimulation({ patientId }: HofSimulationProps) {
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const photoCanvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Backend hooks - always call but only use when patientId is provided
  // Using empty string as fallback to satisfy hooks rules (hooks must be called unconditionally)
  const faceogramResult = useFaceogram(patientId || '')
  const hofPhotosResult = useHofPhotos(patientId || '')

  // Only use the hooks when patientId is actually provided
  const faceogram = patientId ? faceogramResult : null
  const hofPhotos = patientId ? hofPhotosResult : null

  // MediaPipe hook
  const {
    modelLoaded,
    isLoading: mediaPipeLoading,
    detectedLandmarks,
    detectFace
  } = useMediaPipe()

  // MLS Warp hook
  const { applyWarp, applySkinEffects } = useMlsWarp()

  // Sculpt hook
  const sculpt = useSculptEngine()

  // Image state
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)
  const [photoLoaded, setPhotoLoaded] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [isDetecting, setIsDetecting] = useState(false)

  // Zone state
  const [zones, setZones] = useState<Record<string, ZoneState>>(() => initializeZones())
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [visibleZones, setVisibleZones] = useState<Set<string>>(new Set())
  const [showAllZones, setShowAllZones] = useState(false)

  // Procedure state
  const [procedures, setProcedures] = useState<Record<string, ProcedureData>>({})

  // Mode state
  const [overlayVisible, setOverlayVisible] = useState(true)
  const [overlayOpacity, setOverlayOpacity] = useState(50)
  const [showLandmarks, setShowLandmarks] = useState(false)
  const [repositionMode, setRepositionMode] = useState(false)
  const [beforeAfterMode, setBeforeAfterMode] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [currentGender, setCurrentGender] = useState<'F' | 'M'>('F')

  // Apply simulation effect whenever procedures or zones change
  const applySimulation = useCallback(() => {
    if (!photoLoaded || !originalImage || !photoCanvasRef.current) return

    const canvas = photoCanvasRef.current
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    // Draw original image
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height)

    // If no procedures, just show original
    if (Object.keys(procedures).length === 0) return

    // Get original image data
    const originalData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    // Apply MLS warping
    const warpedData = applyWarp(originalData, procedures, zones, detectedLandmarks)

    // Put warped image
    ctx.putImageData(warpedData, 0, 0)

    // Apply skin effects
    applySkinEffects(ctx, canvas, procedures, zones)
  }, [photoLoaded, originalImage, procedures, zones, detectedLandmarks, applyWarp, applySkinEffects])

  // Apply simulation when dependencies change
  useEffect(() => {
    if (!sculpt.isActive) {
      applySimulation()
    }
  }, [applySimulation, sculpt.isActive])

  // Load image
  const loadImage = useCallback(async (src: string) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    return new Promise<void>((resolve, reject) => {
      img.onload = async () => {
        setOriginalImage(img)
        setPhotoLoaded(true)

        // Calculate canvas size
        const container = containerRef.current
        if (!container) return

        const maxH = container.clientHeight - 10
        const maxW = container.clientWidth - 10
        const scale = Math.min(maxW / img.width, maxH / img.height, 1)

        const width = Math.round(img.width * scale)
        const height = Math.round(img.height * scale)
        setCanvasSize({ width, height })

        // Draw on canvas
        if (photoCanvasRef.current) {
          const canvas = photoCanvasRef.current
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)
        }

        // Detect face if model loaded
        if (modelLoaded) {
          setIsDetecting(true)
          const landmarks = await detectFace(img)
          if (landmarks) {
            // Align zones to detected landmarks
            const updatedZones = { ...zones }
            alignZonesToLandmarks(updatedZones, landmarks)
            setZones(updatedZones)
          }
          setIsDetecting(false)
        }

        resolve()
      }
      img.onerror = reject
      img.src = src
    })
  }, [modelLoaded, detectFace, zones])

  // Handle file upload
  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result) {
        loadImage(ev.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }, [loadImage])

  // Zone selection
  const handleSelectZone = useCallback((zoneId: string) => {
    if (repositionMode) return
    setSelectedZone(zoneId)
    setVisibleZones(prev => new Set([...prev, zoneId]))
  }, [repositionMode])

  // Zone visibility toggle
  const handleToggleVisibility = useCallback((zoneId: string) => {
    setVisibleZones(prev => {
      const next = new Set(prev)
      if (next.has(zoneId)) {
        next.delete(zoneId)
      } else {
        next.add(zoneId)
      }
      return next
    })
  }, [])

  // Show all zones toggle
  const handleToggleShowAll = useCallback(() => {
    setShowAllZones(prev => {
      if (!prev) {
        // Show all
        setVisibleZones(new Set(ZONE_DEFS.map(z => z.id)))
      } else {
        // Hide all except procedures
        setVisibleZones(new Set(Object.keys(procedures)))
      }
      return !prev
    })
  }, [procedures])

  // Save procedure
  const handleSaveProcedure = useCallback(async (data: Partial<ProcedureData>) => {
    if (!selectedZone || !data.type) return

    const procedureData = data as ProcedureData

    // Update local state
    setProcedures(prev => ({
      ...prev,
      [selectedZone]: procedureData
    }))

    setVisibleZones(prev => new Set([...prev, selectedZone]))
    setSelectedZone(null)

    // Save to backend if patientId is provided
    if (faceogram && patientId) {
      try {
        await faceogram.createEntry({
          region: mapZoneToFacialRegion(selectedZone) as FacialRegion,
          procedure_type: mapProcedureToHofType(procedureData.type) as HofProcedureType,
          product_name: PROCEDURE_NAMES[procedureData.type] || procedureData.type,
          quantity: procedureData.dosage || undefined,
          notes: procedureData.product ? `Produto: ${procedureData.product}` : undefined
        })
      } catch (error) {
        console.error('Failed to save to backend:', error)
      }
    }
  }, [selectedZone, faceogram, patientId])

  // Remove procedure
  const handleRemoveProcedure = useCallback((zoneId: string) => {
    setProcedures(prev => {
      const next = { ...prev }
      delete next[zoneId]
      return next
    })
  }, [])

  // Cancel form
  const handleCancelForm = useCallback(() => {
    setSelectedZone(null)
  }, [])

  // Zone position update (reposition mode)
  const handleZoneDrag = useCallback((zoneId: string, dx: number, dy: number) => {
    setZones(prev => {
      const zone = prev[zoneId]
      if (!zone) return prev

      const updated = { ...zone }
      updateZonePos(updated, dx, dy)

      return { ...prev, [zoneId]: updated }
    })
  }, [])

  // Zone size update (reposition mode)
  const handleZoneResize = useCallback((zoneId: string, drx: number, dry: number) => {
    setZones(prev => {
      const zone = prev[zoneId]
      if (!zone) return prev

      const updated = { ...zone }
      updateZoneSz(updated, drx, dry)

      return { ...prev, [zoneId]: updated }
    })
  }, [])

  // Reset positions
  const handleResetPositions = useCallback(() => {
    const resetZones = { ...zones }
    resetZonesToDefaults(resetZones)

    if (detectedLandmarks) {
      alignZonesToLandmarks(resetZones, detectedLandmarks)
    }

    setZones(resetZones)
  }, [zones, detectedLandmarks])

  // Toggle reposition mode
  const handleToggleReposition = useCallback(() => {
    setRepositionMode(prev => {
      if (!prev) {
        setOverlayOpacity(80)
      } else {
        setOverlayOpacity(50)
      }
      return !prev
    })
  }, [])

  // Toggle sculpt mode
  const handleToggleSculpt = useCallback(() => {
    if (!photoLoaded || !originalImage || !photoCanvasRef.current) return

    if (!sculpt.isActive) {
      const canvas = photoCanvasRef.current
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      // Apply simulation first
      applySimulation()

      // Get current canvas state as original for sculpting
      const originalData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      sculpt.activate(canvas.width, canvas.height, originalData)
    } else {
      sculpt.deactivate()
      // Re-apply simulation (which will include sculpt result)
      applySimulation()
    }
  }, [photoLoaded, originalImage, sculpt, applySimulation])

  // Toggle before/after view
  const handleToggleBeforeAfter = useCallback(() => {
    if (!photoLoaded) return
    setBeforeAfterMode(prev => !prev)
  }, [photoLoaded])

  // Export image
  const handleExport = useCallback(async () => {
    if (!photoCanvasRef.current) return

    const dataUrl = photoCanvasRef.current.toDataURL('image/png')

    // Download locally
    const link = document.createElement('a')
    link.download = `HOF_simulacao_${new Date().toISOString().slice(0, 10)}.png`
    link.href = dataUrl
    link.click()

    // Save to backend if patientId is provided
    if (hofPhotos && patientId) {
      try {
        // Convert data URL to blob
        const res = await fetch(dataUrl)
        const blob = await res.blob()
        const file = new File([blob], `simulation_${Date.now()}.png`, { type: 'image/png' })

        const formData = new FormData()
        formData.append('file', file)
        formData.append('photo_type', 'AFTER')
        formData.append('caption', 'Simulação HOF')

        await hofPhotos.upload(formData)
        toast.success('Imagem salva no prontuário do paciente')
      } catch (error) {
        console.error('Failed to save image to backend:', error)
        toast.error('Erro ao salvar imagem no prontuário')
      }
    }
  }, [hofPhotos, patientId])

  // Trigger file input
  const triggerUpload = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-200">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-1.5 bg-gradient-to-r from-teal-600 to-teal-700 h-[42px]">
        <span className="text-lg font-bold text-white tracking-tight">INTER-IA</span>
        <span className="text-xs text-teal-100">Modulo HOF v7</span>
        <span className="bg-white/15 px-2 py-0.5 rounded-lg text-[9px] text-teal-100 font-semibold">
          MediaPipe AI
        </span>
        <span className="text-[10px] text-teal-100 opacity-80 ml-auto">
          Harmonizacao Orofacial — Simulacao com IA
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Zones */}
        <ZoneSidebar
          zones={zones}
          selectedZone={selectedZone}
          visibleZones={visibleZones}
          showAllZones={showAllZones}
          procedures={procedures}
          currentGender={currentGender}
          onSelectZone={handleSelectZone}
          onToggleVisibility={handleToggleVisibility}
          onToggleShowAll={handleToggleShowAll}
          onSwitchGender={setCurrentGender}
        />

        {/* Center - Canvas area */}
        <div className="flex-1 flex flex-col bg-slate-900">
          {/* Toolbar */}
          <SimulationToolbar
            photoLoaded={photoLoaded}
            overlayVisible={overlayVisible}
            showLandmarks={showLandmarks}
            repositionMode={repositionMode}
            sculptMode={sculpt.isActive}
            beforeAfterMode={beforeAfterMode}
            overlayOpacity={overlayOpacity}
            zoom={zoom}
            onToggleOverlay={() => setOverlayVisible(prev => !prev)}
            onToggleLandmarks={() => setShowLandmarks(prev => !prev)}
            onToggleReposition={handleToggleReposition}
            onToggleSculpt={handleToggleSculpt}
            onToggleBeforeAfter={handleToggleBeforeAfter}
            onOpacityChange={setOverlayOpacity}
            onZoomChange={setZoom}
            onUpload={triggerUpload}
            onExport={handleExport}
          />

          {/* Photo area */}
          <div
            ref={containerRef}
            className="flex-1 relative overflow-hidden flex items-center justify-center"
            style={{
              background: 'radial-gradient(ellipse at center, #1a2332, #111827)'
            }}
          >
            {/* Placeholder */}
            {!photoLoaded && (
              <div className="text-center text-slate-500 p-10">
                <ImageOff size={48} className="mx-auto mb-3 opacity-50" />
                <h2 className="text-base text-slate-400 mb-1.5">
                  Carregue uma foto do paciente
                </h2>
                <p className="text-xs">
                  Use o botao Upload ou selecione um exemplo abaixo.<br />
                  A IA detectara automaticamente os pontos faciais.
                </p>
              </div>
            )}

            {/* Canvas container */}
            {photoLoaded && (
              <div
                className="relative inline-block"
                style={{ transform: `scale(${zoom / 100})` }}
              >
                <canvas
                  ref={photoCanvasRef}
                  className="block rounded-md shadow-xl"
                  style={{ userSelect: 'none' }}
                />

                {/* Zone overlay */}
                {overlayVisible && (
                  <ZoneOverlay
                    zones={zones}
                    selectedZone={selectedZone}
                    visibleZones={visibleZones}
                    procedures={procedures}
                    repositionMode={repositionMode}
                    canvasWidth={canvasSize.width}
                    canvasHeight={canvasSize.height}
                    overlayOpacity={overlayOpacity}
                    onZoneClick={handleSelectZone}
                    onZoneDrag={handleZoneDrag}
                    onZoneResize={handleZoneResize}
                  />
                )}

                {/* Sculpt cursor */}
                {sculpt.isActive && (
                  <div
                    className="absolute border-2 border-indigo-400/80 rounded-full pointer-events-none"
                    style={{
                      width: sculpt.brushSize * 2,
                      height: sculpt.brushSize * 2,
                      transform: 'translate(-50%, -50%)',
                      boxShadow: '0 0 8px rgba(99,102,241,0.3)'
                    }}
                  />
                )}
              </div>
            )}

            {/* Mode badges */}
            {repositionMode && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold shadow-lg">
                MODO REPOSICIONAR — Arraste as elipses
              </div>
            )}

            {Object.keys(procedures).length > 0 && photoLoaded && !repositionMode && !sculpt.isActive && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-md bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold shadow-lg">
                SIMULACAO ATIVA
              </div>
            )}

            {isDetecting && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-md bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold shadow-lg">
                DETECTANDO ROSTO...
              </div>
            )}

            {sculpt.isActive && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-lg">
                MODO ESCULPIR — Clique e arraste para deformar
              </div>
            )}

            {/* Loading overlay */}
            {(mediaPipeLoading || isDetecting) && (
              <div className="absolute inset-0 bg-slate-900/85 flex flex-col items-center justify-center gap-3">
                <Loader2 size={40} className="animate-spin text-teal-500" />
                <span className="text-xs text-slate-400">
                  {mediaPipeLoading ? 'Carregando modelo de IA...' : 'Detectando pontos faciais...'}
                </span>
              </div>
            )}
          </div>

          {/* Sculpt toolbar */}
          <SculptToolbar
            isActive={sculpt.isActive}
            tool={sculpt.tool}
            brushSize={sculpt.brushSize}
            strength={sculpt.strength}
            canUndo={sculpt.canUndo}
            onToolChange={sculpt.setTool}
            onBrushSizeChange={sculpt.setBrushSize}
            onStrengthChange={sculpt.setStrength}
            onUndo={sculpt.undo}
            onReset={sculpt.reset}
            onDone={handleToggleSculpt}
          />

          {/* Examples bar (placeholder) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 border-t border-slate-700">
            <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wide">
              Exemplos:
            </span>
            <span className="text-[9px] text-slate-600 italic">
              Carregue uma foto usando o botao Upload
            </span>
          </div>
        </div>

        {/* Right Sidebar - Procedures */}
        <ProcedureSidebar
          selectedZone={selectedZone}
          zones={zones}
          procedures={procedures}
          onSave={handleSaveProcedure}
          onRemove={handleRemoveProcedure}
          onCancel={handleCancelForm}
        />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  )
}

export default HofSimulation
