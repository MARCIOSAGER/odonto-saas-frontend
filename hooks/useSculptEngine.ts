"use client"

/**
 * useSculptEngine - Hook for interactive image sculpting
 * Manages displacement map state, brush application, and undo history
 */

import { useState, useCallback, useRef } from 'react'
import {
  createDisplacementMap,
  cloneDisplacementMap,
  resetDisplacementMap,
  applySculptBrush,
  renderWithDisplacement,
  type SculptTool,
  type SculptParams
} from '@/lib/hof/sculpt-engine'

const MAX_HISTORY = 30

interface UseSculptEngineOptions {
  /** Maximum undo history size */
  maxHistory?: number
}

interface UseSculptEngineReturn {
  /** Current sculpt tool */
  tool: SculptTool
  /** Brush size in pixels */
  brushSize: number
  /** Brush strength (0-100) */
  strength: number
  /** Whether sculpt mode is active */
  isActive: boolean
  /** Displacement map (null if not initialized) */
  displacementMap: Float32Array | null
  /** Original image data before sculpting */
  originalData: ImageData | null
  /** Current sculpt parameters */
  params: SculptParams

  /** Set the sculpt tool */
  setTool: (tool: SculptTool) => void
  /** Set brush size */
  setBrushSize: (size: number) => void
  /** Set brush strength */
  setStrength: (strength: number) => void
  /** Activate sculpt mode with image dimensions */
  activate: (width: number, height: number, originalData: ImageData) => void
  /** Deactivate sculpt mode */
  deactivate: () => void
  /** Apply brush stroke at position */
  applyBrush: (cx: number, cy: number, dx: number, dy: number) => void
  /** Save current state to history (call before applying brush) */
  saveToHistory: () => void
  /** Undo last brush stroke */
  undo: () => boolean
  /** Reset all sculpt changes */
  reset: () => void
  /** Render sculpted image from original */
  render: () => ImageData | null
  /** Check if there are undo steps available */
  canUndo: boolean
}

/**
 * Hook for managing sculpt engine state and operations
 */
export function useSculptEngine(options: UseSculptEngineOptions = {}): UseSculptEngineReturn {
  const { maxHistory = MAX_HISTORY } = options

  const [tool, setTool] = useState<SculptTool>('push')
  const [brushSize, setBrushSize] = useState(40)
  const [strength, setStrength] = useState(50)
  const [isActive, setIsActive] = useState(false)

  // Use refs for performance-critical state
  const displacementMapRef = useRef<Float32Array | null>(null)
  const originalDataRef = useRef<ImageData | null>(null)
  const historyRef = useRef<Float32Array[]>([])
  const dimensionsRef = useRef({ width: 0, height: 0 })

  // Trigger re-renders for canUndo
  const [historyLength, setHistoryLength] = useState(0)

  const params: SculptParams = {
    tool,
    brushSize,
    strength
  }

  const activate = useCallback((width: number, height: number, originalData: ImageData) => {
    dimensionsRef.current = { width, height }
    originalDataRef.current = originalData

    // Initialize or resize displacement map
    if (
      !displacementMapRef.current ||
      displacementMapRef.current.length !== width * height * 2
    ) {
      displacementMapRef.current = createDisplacementMap(width, height)
    }

    historyRef.current = []
    setHistoryLength(0)
    setIsActive(true)
  }, [])

  const deactivate = useCallback(() => {
    setIsActive(false)
  }, [])

  const saveToHistory = useCallback(() => {
    if (!displacementMapRef.current) return

    // Clone current state
    const snapshot = cloneDisplacementMap(displacementMapRef.current)
    historyRef.current.push(snapshot)

    // Limit history size
    if (historyRef.current.length > maxHistory) {
      historyRef.current.shift()
    }

    setHistoryLength(historyRef.current.length)
  }, [maxHistory])

  const applyBrush = useCallback((cx: number, cy: number, dx: number, dy: number) => {
    if (!displacementMapRef.current) return

    const { width, height } = dimensionsRef.current

    applySculptBrush(
      displacementMapRef.current,
      width,
      height,
      cx,
      cy,
      dx,
      dy,
      params
    )
  }, [params])

  const undo = useCallback((): boolean => {
    if (historyRef.current.length === 0 || !displacementMapRef.current) {
      return false
    }

    const previous = historyRef.current.pop()
    if (previous) {
      displacementMapRef.current.set(previous)
      setHistoryLength(historyRef.current.length)
      return true
    }

    return false
  }, [])

  const reset = useCallback(() => {
    if (displacementMapRef.current) {
      resetDisplacementMap(displacementMapRef.current)
    }
    historyRef.current = []
    setHistoryLength(0)
  }, [])

  const render = useCallback((): ImageData | null => {
    if (!originalDataRef.current || !displacementMapRef.current) {
      return null
    }

    return renderWithDisplacement(originalDataRef.current, displacementMapRef.current)
  }, [])

  return {
    tool,
    brushSize,
    strength,
    isActive,
    displacementMap: displacementMapRef.current,
    originalData: originalDataRef.current,
    params,

    setTool,
    setBrushSize,
    setStrength,
    activate,
    deactivate,
    applyBrush,
    saveToHistory,
    undo,
    reset,
    render,
    canUndo: historyLength > 0
  }
}

export default useSculptEngine
