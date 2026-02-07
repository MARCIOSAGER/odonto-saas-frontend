"use client"

/**
 * useMlsWarp - Hook for MLS (Moving Least Squares) image warping
 * Applies procedure-based facial deformation using landmarks
 */

import { useCallback } from 'react'
import { applyMlsWarp, applySkinEffect } from '@/lib/hof/mls-engine'
import {
  collectAllWarpPoints,
  type ZoneState,
  type ProcedureData,
  type NormalizedLandmark
} from '@/lib/hof/warp-strategies'

interface UseMlsWarpReturn {
  /**
   * Apply MLS warping to an image based on procedures and landmarks
   *
   * @param originalData - Source image data
   * @param procedures - Active procedures by zone ID
   * @param zones - Runtime zone states
   * @param landmarks - Detected face landmarks
   * @returns Warped image data
   */
  applyWarp: (
    originalData: ImageData,
    procedures: Record<string, ProcedureData>,
    zones: Record<string, ZoneState>,
    landmarks: NormalizedLandmark[] | null
  ) => ImageData

  /**
   * Apply skin effects (blur, brightness) to specific zones
   * Call after warping for enhanced realism
   */
  applySkinEffects: (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    procedures: Record<string, ProcedureData>,
    zones: Record<string, ZoneState>
  ) => void
}

/**
 * Hook for applying MLS image warping
 */
export function useMlsWarp(): UseMlsWarpReturn {
  const applyWarp = useCallback(
    (
      originalData: ImageData,
      procedures: Record<string, ProcedureData>,
      zones: Record<string, ZoneState>,
      landmarks: NormalizedLandmark[] | null
    ): ImageData => {
      const W = originalData.width
      const H = originalData.height

      // No procedures = return original
      if (Object.keys(procedures).length === 0) {
        return originalData
      }

      // Collect warp points from all procedures
      const { from, to } = collectAllWarpPoints(procedures, zones, landmarks, W, H)

      // No warp points = return original
      if (from.length === 0 || to.length === 0) {
        return originalData
      }

      // Apply MLS warping
      return applyMlsWarp(originalData, from, to, 8)
    },
    []
  )

  const applySkinEffects = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      procedures: Record<string, ProcedureData>,
      zones: Record<string, ZoneState>
    ) => {
      const W = canvas.width
      const H = canvas.height

      // Apply skin effects for each procedure
      Object.entries(procedures).forEach(([zoneId, proc]) => {
        const zone = zones[zoneId]
        if (!zone) return

        const r = zone.simRegion
        const intensity = (proc.intensity || 70) / 100

        // Convert normalized coords to pixels
        const cx = r.cx * W
        const cy = r.cy * H
        const rx = r.rx * W
        const ry = r.ry * H

        applySkinEffect(ctx, canvas, cx, cy, rx, ry, intensity, zone.simType)
      })
    },
    []
  )

  return {
    applyWarp,
    applySkinEffects
  }
}

export default useMlsWarp
