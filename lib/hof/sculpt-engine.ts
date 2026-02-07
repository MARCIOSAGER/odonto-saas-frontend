/**
 * Sculpt Engine - Interactive Image Deformation
 * Implements brush-based displacement map deformation
 * Similar to Photoshop Liquify tool
 */

export type SculptTool = 'push' | 'inflate' | 'deflate' | 'smooth'

export interface SculptParams {
  tool: SculptTool
  brushSize: number  // Brush radius in pixels
  strength: number   // 0-100
}

export interface SculptState {
  displacementMap: Float32Array | null
  originalData: ImageData | null
  history: Float32Array[]
  width: number
  height: number
}

/**
 * Create a new displacement map for the given dimensions
 * Each pixel has [dx, dy] displacement values
 */
export function createDisplacementMap(width: number, height: number): Float32Array {
  return new Float32Array(width * height * 2)
}

/**
 * Clone a displacement map (for undo history)
 */
export function cloneDisplacementMap(map: Float32Array): Float32Array {
  return new Float32Array(map)
}

/**
 * Reset displacement map to zero
 */
export function resetDisplacementMap(map: Float32Array): void {
  map.fill(0)
}

/**
 * Apply sculpt brush at a position
 *
 * @param displacementMap - The displacement map to modify
 * @param width - Image width
 * @param height - Image height
 * @param cx - Brush center X
 * @param cy - Brush center Y
 * @param mdx - Mouse delta X (for push tool)
 * @param mdy - Mouse delta Y (for push tool)
 * @param params - Sculpt parameters (tool, size, strength)
 */
export function applySculptBrush(
  displacementMap: Float32Array,
  width: number,
  height: number,
  cx: number,
  cy: number,
  mdx: number,
  mdy: number,
  params: SculptParams
): void {
  const { tool, brushSize: radius, strength } = params
  const strengthNorm = strength / 100

  const r2 = radius * radius
  const x0 = Math.max(0, Math.floor(cx - radius))
  const y0 = Math.max(0, Math.floor(cy - radius))
  const x1 = Math.min(width - 1, Math.ceil(cx + radius))
  const y1 = Math.min(height - 1, Math.ceil(cy + radius))

  for (let py = y0; py <= y1; py++) {
    for (let px = x0; px <= x1; px++) {
      const dx = px - cx
      const dy = py - cy
      const d2 = dx * dx + dy * dy

      if (d2 >= r2) continue

      // Gaussian-like smooth falloff
      const dist = Math.sqrt(d2) / radius
      const falloff = Math.exp(-dist * dist * 3) * (1 - dist)

      if (falloff <= 0) continue

      const idx = (py * width + px) * 2
      const f = falloff * strengthNorm

      switch (tool) {
        case 'push':
          // Move pixels in direction of mouse drag
          displacementMap[idx] += mdx * f * 0.8
          displacementMap[idx + 1] += mdy * f * 0.8
          break

        case 'inflate':
          // Push pixels outward from brush center
          if (d2 > 0.1) {
            const nd = Math.sqrt(d2)
            displacementMap[idx] += (dx / nd) * f * 3
            displacementMap[idx + 1] += (dy / nd) * f * 3
          }
          break

        case 'deflate':
          // Pull pixels inward toward brush center
          if (d2 > 0.1) {
            const nd = Math.sqrt(d2)
            displacementMap[idx] -= (dx / nd) * f * 3
            displacementMap[idx + 1] -= (dy / nd) * f * 3
          }
          break

        case 'smooth':
          // Reduce existing displacement (relaxation)
          displacementMap[idx] *= 1 - f * 0.3
          displacementMap[idx + 1] *= 1 - f * 0.3
          break
      }
    }
  }
}

/**
 * Render image with displacement map applied
 * Uses reverse mapping with bilinear interpolation
 *
 * @param originalData - Original image data to deform
 * @param displacementMap - Displacement map [dx, dy] per pixel
 * @returns New ImageData with deformation applied
 */
export function renderWithDisplacement(
  originalData: ImageData,
  displacementMap: Float32Array
): ImageData {
  const W = originalData.width
  const H = originalData.height
  const src = originalData.data
  const dst = new ImageData(W, H)
  const dstData = dst.data

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 2

      // Reverse mapping: find where to sample from
      const srcX = x - displacementMap[idx]
      const srcY = y - displacementMap[idx + 1]

      // Bilinear interpolation
      if (srcX >= 0 && srcX < W - 1 && srcY >= 0 && srcY < H - 1) {
        const sx0 = Math.floor(srcX)
        const sy0 = Math.floor(srcY)
        const fx = srcX - sx0
        const fy = srcY - sy0

        const s00 = (sy0 * W + sx0) * 4
        const s10 = s00 + 4
        const s01 = s00 + W * 4
        const s11 = s01 + 4
        const di = (y * W + x) * 4

        for (let c = 0; c < 3; c++) {
          dstData[di + c] = Math.round(
            (1 - fy) * ((1 - fx) * src[s00 + c] + fx * src[s10 + c]) +
            fy * ((1 - fx) * src[s01 + c] + fx * src[s11 + c])
          )
        }
        dstData[di + 3] = 255
      } else {
        // Out of bounds - use nearest edge pixel
        const clampX = Math.max(0, Math.min(W - 1, Math.round(srcX)))
        const clampY = Math.max(0, Math.min(H - 1, Math.round(srcY)))
        const si = (clampY * W + clampX) * 4
        const di = (y * W + x) * 4
        dstData[di] = src[si]
        dstData[di + 1] = src[si + 1]
        dstData[di + 2] = src[si + 2]
        dstData[di + 3] = 255
      }
    }
  }

  return dst
}

/**
 * Get displacement map statistics (for debugging)
 */
export function getDisplacementStats(
  displacementMap: Float32Array
): { nonZeroCount: number; maxDisplacement: number } {
  let nonZeroCount = 0
  let maxDisplacement = 0

  for (let i = 0; i < displacementMap.length; i++) {
    const val = Math.abs(displacementMap[i])
    if (val > 0.01) nonZeroCount++
    if (val > maxDisplacement) maxDisplacement = val
  }

  return { nonZeroCount, maxDisplacement }
}

/**
 * Combine sculpt displacement with MLS warp result
 * The sculpt is applied on top of the MLS-warped image
 */
export function combineSculptWithWarp(
  warpedData: ImageData,
  displacementMap: Float32Array | null
): ImageData {
  if (!displacementMap) return warpedData

  // Check if there are any displacements
  const stats = getDisplacementStats(displacementMap)
  if (stats.nonZeroCount === 0) return warpedData

  // Apply displacement to warped image
  return renderWithDisplacement(warpedData, displacementMap)
}

/**
 * Canvas coordinate helper - convert client coords to canvas coords
 */
export function getCanvasCoords(
  event: MouseEvent | Touch,
  canvasRect: DOMRect,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number; clientX: number; clientY: number } {
  const scaleX = canvasWidth / canvasRect.width
  const scaleY = canvasHeight / canvasRect.height

  return {
    x: (event.clientX - canvasRect.left) * scaleX,
    y: (event.clientY - canvasRect.top) * scaleY,
    clientX: event.clientX,
    clientY: event.clientY
  }
}
