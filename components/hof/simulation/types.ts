/**
 * HOF Simulation Module Types
 */

import type { SimType, Tercio } from '@/lib/hof/zone-definitions'
import type { SculptTool } from '@/lib/hof/sculpt-engine'

/**
 * Runtime zone state with current position
 */
export interface ZoneState {
  id: string
  simType: SimType
  simRegion: {
    cx: number
    cy: number
    rx: number
    ry: number
  }
}

/**
 * Procedure data stored per zone
 */
export interface ProcedureData {
  zone: string
  zoneName: string
  type: string
  typeName: string
  product?: string
  dosage?: string
  lot?: string
  cost: number
  intensity: number
  notes?: string
}

/**
 * Main simulation state
 */
export interface SimulationState {
  // Image state
  originalImage: HTMLImageElement | null
  photoLoaded: boolean
  canvasSize: { width: number; height: number }

  // Zone state
  zones: Record<string, ZoneState>
  selectedZone: string | null
  visibleZones: Set<string>
  showAllZones: boolean

  // Procedure state
  procedures: Record<string, ProcedureData>

  // Mode state
  overlayVisible: boolean
  overlayOpacity: number
  showLandmarks: boolean
  repositionMode: boolean
  sculptMode: boolean
  beforeAfterMode: boolean
  zoom: number

  // Gender
  currentGender: 'F' | 'M'
}

/**
 * Simulation actions
 */
export interface SimulationActions {
  // Image
  loadImage: (src: string) => Promise<void>
  handleUpload: (file: File) => void

  // Zone
  selectZone: (zoneId: string | null) => void
  toggleZoneVisibility: (zoneId: string) => void
  toggleShowAllZones: () => void

  // Procedure
  saveProcedure: (data: Partial<ProcedureData>) => void
  removeProcedure: (zoneId: string) => void

  // Modes
  toggleOverlay: () => void
  toggleLandmarks: () => void
  toggleReposition: () => void
  toggleSculptMode: () => void
  toggleBeforeAfter: () => void
  setOpacity: (value: number) => void
  setZoom: (value: number) => void

  // Reposition
  updateZonePosition: (zoneId: string, dx: number, dy: number) => void
  updateZoneSize: (zoneId: string, drx: number, dry: number) => void
  resetPositions: () => void

  // Gender
  switchGender: (gender: 'F' | 'M') => void

  // Export
  exportImage: () => void
}

/**
 * Zone sidebar props
 */
export interface ZoneSidebarProps {
  zones: Record<string, ZoneState>
  selectedZone: string | null
  visibleZones: Set<string>
  showAllZones: boolean
  procedures: Record<string, ProcedureData>
  currentGender: 'F' | 'M'
  onSelectZone: (zoneId: string) => void
  onToggleVisibility: (zoneId: string) => void
  onToggleShowAll: () => void
  onSwitchGender: (gender: 'F' | 'M') => void
}

/**
 * Procedure sidebar props
 */
export interface ProcedureSidebarProps {
  selectedZone: string | null
  zones: Record<string, ZoneState>
  procedures: Record<string, ProcedureData>
  onSave: (data: Partial<ProcedureData>) => void
  onRemove: (zoneId: string) => void
  onCancel: () => void
}

/**
 * Simulation canvas props
 */
export interface SimulationCanvasProps {
  originalImage: HTMLImageElement | null
  photoLoaded: boolean
  canvasSize: { width: number; height: number }
  procedures: Record<string, ProcedureData>
  zones: Record<string, ZoneState>
  overlayVisible: boolean
  overlayOpacity: number
  showLandmarks: boolean
  repositionMode: boolean
  sculptMode: boolean
  selectedZone: string | null
  visibleZones: Set<string>
  zoom: number
  onZoneSelect: (zoneId: string) => void
  onZoneMove: (zoneId: string, dx: number, dy: number) => void
  onZoneResize: (zoneId: string, drx: number, dry: number) => void
}

/**
 * Toolbar props
 */
export interface SimulationToolbarProps {
  photoLoaded: boolean
  overlayVisible: boolean
  showLandmarks: boolean
  repositionMode: boolean
  sculptMode: boolean
  beforeAfterMode: boolean
  overlayOpacity: number
  zoom: number
  onToggleOverlay: () => void
  onToggleLandmarks: () => void
  onToggleReposition: () => void
  onToggleSculpt: () => void
  onToggleBeforeAfter: () => void
  onOpacityChange: (value: number) => void
  onZoomChange: (value: number) => void
  onUpload: () => void
  onExport: () => void
}

/**
 * Sculpt toolbar props
 */
export interface SculptToolbarProps {
  isActive: boolean
  tool: SculptTool
  brushSize: number
  strength: number
  canUndo: boolean
  onToolChange: (tool: SculptTool) => void
  onBrushSizeChange: (size: number) => void
  onStrengthChange: (strength: number) => void
  onUndo: () => void
  onReset: () => void
  onDone: () => void
}

/**
 * Zone overlay props
 */
export interface ZoneOverlayProps {
  zones: Record<string, ZoneState>
  selectedZone: string | null
  visibleZones: Set<string>
  procedures: Record<string, ProcedureData>
  repositionMode: boolean
  canvasWidth: number
  canvasHeight: number
  overlayOpacity: number
  onZoneClick: (zoneId: string) => void
  onZoneDrag: (zoneId: string, dx: number, dy: number) => void
  onZoneResize: (zoneId: string, drx: number, dry: number) => void
}

/**
 * Before/After view props
 */
export interface BeforeAfterViewProps {
  originalImage: HTMLImageElement | null
  simulatedCanvas: HTMLCanvasElement | null
  isActive: boolean
  maxHeight: number
}

/**
 * Drag state for zone repositioning
 */
export interface DragState {
  type: 'move' | 'resize'
  zoneId: string
  startClientX: number
  startClientY: number
  origCx: number
  origCy: number
  origRx: number
  origRy: number
  scaleX: number
  scaleY: number
}

/**
 * MediaPipe normalized landmark
 */
export interface NormalizedLandmark {
  x: number
  y: number
  z: number
}

/**
 * Zone definition (from zone-definitions.ts)
 */
export interface ZoneDef {
  id: string
  name: string
  tercio: Tercio
  color: string
  simType: SimType
  cx: number
  cy: number
  rx: number
  ry: number
  maxRx?: number
  maxRy?: number
  landmarks: number[]
}
