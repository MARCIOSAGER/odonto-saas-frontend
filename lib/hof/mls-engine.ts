/**
 * MLS (Moving Least Squares) Warping Engine
 * Implements affine image deformation based on control points
 * Used for facial procedure simulation
 */

/**
 * 2D Point class with vector operations
 */
export class MLSPoint {
  constructor(public x: number, public y: number) {}

  add(o: MLSPoint): MLSPoint {
    return new MLSPoint(this.x + o.x, this.y + o.y)
  }

  sub(o: MLSPoint): MLSPoint {
    return new MLSPoint(this.x - o.x, this.y - o.y)
  }

  mul(s: number): MLSPoint {
    return new MLSPoint(this.x * s, this.y * s)
  }

  dot(o: MLSPoint): number {
    return this.x * o.x + this.y * o.y
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  /**
   * Compute weighted outer product matrix components
   */
  wXtX(w: number): [number, number, number, number] {
    return [
      this.x * this.x * w,
      this.x * this.y * w,
      this.y * this.x * w,
      this.y * this.y * w
    ]
  }

  /**
   * Multiply by 2x2 matrix (stored as [a, b, c, d] = [[a,b],[c,d]])
   */
  mulM(m: [number, number, number, number]): MLSPoint {
    return new MLSPoint(
      this.x * m[0] + this.y * m[2],
      this.x * m[1] + this.y * m[3]
    )
  }

  /**
   * Compute weighted average of points
   */
  static wavg(pts: MLSPoint[], w: number[]): MLSPoint {
    let sx = 0, sy = 0, sw = 0
    for (let i = 0; i < pts.length; i++) {
      sx += pts[i].x * w[i]
      sy += pts[i].y * w[i]
      sw += w[i]
    }
    if (sw < 1e-10) return new MLSPoint(0, 0)
    return new MLSPoint(sx / sw, sy / sw)
  }
}

type Matrix2x2 = [number, number, number, number]

/**
 * Invert a 2x2 matrix
 * Matrix format: [a, b, c, d] represents [[a, b], [c, d]]
 */
function mat22inv(m: Matrix2x2): Matrix2x2 {
  const det = m[0] * m[3] - m[1] * m[2]
  if (Math.abs(det) < 1e-10) {
    // Return identity for singular matrix
    return [1, 0, 0, 1]
  }
  const id = 1 / det
  return [m[3] * id, -m[1] * id, -m[2] * id, m[0] * id]
}

/**
 * MLS Affine Deformation
 * Given control points that move from `fromPts` to `toPts`,
 * compute where a given `point` should map to.
 *
 * @param fromPts - Original control point positions
 * @param toPts - Target control point positions
 * @param point - Point to deform
 * @param alpha - Weight falloff exponent (default 1)
 * @returns Deformed point position
 */
export function mlsDeform(
  fromPts: MLSPoint[],
  toPts: MLSPoint[],
  point: MLSPoint,
  alpha: number = 1
): MLSPoint {
  const n = fromPts.length
  if (n === 0) return point

  // Compute weights based on distance to control points
  const w = new Array<number>(n)
  for (let i = 0; i < n; i++) {
    const t = fromPts[i].sub(point)
    const d2 = t.x * t.x + t.y * t.y
    // Avoid division by zero - use large weight if very close
    w[i] = d2 < 0.01 ? 1e8 : Math.pow(d2, -alpha)
  }

  // Compute weighted centroids
  const pAvg = MLSPoint.wavg(fromPts, w)
  const qAvg = MLSPoint.wavg(toPts, w)

  // Build covariance matrix B
  let B: Matrix2x2 = [0, 0, 0, 0]
  for (let i = 0; i < n; i++) {
    const pr = fromPts[i].sub(pAvg)
    const wx = pr.wXtX(w[i])
    B[0] += wx[0]
    B[1] += wx[1]
    B[2] += wx[2]
    B[3] += wx[3]
  }

  // Invert B and compute transform
  const Binv = mat22inv(B)
  const vpA = point.sub(pAvg).mulM(Binv)

  // Apply weighted transformation
  let rx = qAvg.x, ry = qAvg.y
  for (let j = 0; j < n; j++) {
    const pr = fromPts[j].sub(pAvg)
    const qr = toPts[j].sub(qAvg)
    const a = vpA.dot(pr) * w[j]
    rx += qr.x * a
    ry += qr.y * a
  }

  return new MLSPoint(rx, ry)
}

/**
 * Bilinear sampling from ImageData
 */
function bilinearSample(
  srcData: Uint8ClampedArray,
  dstData: Uint8ClampedArray,
  dstX: number,
  dstY: number,
  srcX: number,
  srcY: number,
  W: number,
  H: number
): void {
  // Clamp to valid range
  if (srcX < 0 || srcX >= W - 1 || srcY < 0 || srcY >= H - 1) {
    // Use nearest edge pixel for out-of-bounds
    const clampX = Math.max(0, Math.min(W - 1, Math.round(srcX)))
    const clampY = Math.max(0, Math.min(H - 1, Math.round(srcY)))
    const si = (clampY * W + clampX) * 4
    const di = (dstY * W + dstX) * 4
    dstData[di] = srcData[si]
    dstData[di + 1] = srcData[si + 1]
    dstData[di + 2] = srcData[si + 2]
    dstData[di + 3] = 255
    return
  }

  const sx0 = Math.floor(srcX)
  const sy0 = Math.floor(srcY)
  const sx1 = sx0 + 1
  const sy1 = sy0 + 1
  const fx = srcX - sx0
  const fy = srcY - sy0

  const di = (dstY * W + dstX) * 4
  const s00 = (sy0 * W + sx0) * 4
  const s10 = (sy0 * W + sx1) * 4
  const s01 = (sy1 * W + sx0) * 4
  const s11 = (sy1 * W + sx1) * 4

  for (let c = 0; c < 3; c++) {
    dstData[di + c] = Math.round(
      (1 - fy) * ((1 - fx) * srcData[s00 + c] + fx * srcData[s10 + c]) +
      fy * ((1 - fx) * srcData[s01 + c] + fx * srcData[s11 + c])
    )
  }
  dstData[di + 3] = 255
}

/**
 * Apply MLS warping to entire image using grid-based interpolation
 * Uses a grid to reduce computation - warp is computed at grid points
 * and interpolated for pixels in between.
 *
 * @param originalData - Source image data
 * @param fromPts - Original control point positions (in toPts coords, for reverse mapping)
 * @param toPts - Target control point positions
 * @param gridSize - Size of interpolation grid (default 8 pixels)
 * @returns Warped image data
 */
export function applyMlsWarp(
  originalData: ImageData,
  fromPts: MLSPoint[],
  toPts: MLSPoint[],
  gridSize: number = 8
): ImageData {
  const W = originalData.width
  const H = originalData.height
  const srcData = originalData.data
  const newData = new ImageData(W, H)
  const dstData = newData.data

  // Copy original first (for areas not affected by warp)
  dstData.set(srcData)

  if (fromPts.length === 0 || toPts.length === 0) {
    return newData
  }

  const gridW = Math.ceil(W / gridSize) + 1
  const gridH = Math.ceil(H / gridSize) + 1

  // Precompute warp at grid points
  // For each output pixel, we need to find where to sample from in the original
  // This is the "reverse" mapping: given output position, find input position
  const warpGrid = new Float32Array(gridW * gridH * 2)

  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      const px = Math.min(gx * gridSize, W - 1)
      const py = Math.min(gy * gridSize, H - 1)
      // Reverse mapping: where in the original should we sample from?
      const warped = mlsDeform(toPts, fromPts, new MLSPoint(px, py), 1)
      const idx = (gy * gridW + gx) * 2
      warpGrid[idx] = warped.x
      warpGrid[idx + 1] = warped.y
    }
  }

  // For each output pixel, bilinearly interpolate from grid
  for (let y = 0; y < H; y++) {
    const gy = y / gridSize
    const gy0 = Math.floor(gy)
    const gy1 = Math.min(gy0 + 1, gridH - 1)
    const fy = gy - gy0

    for (let x = 0; x < W; x++) {
      const gx = x / gridSize
      const gx0 = Math.floor(gx)
      const gx1 = Math.min(gx0 + 1, gridW - 1)
      const fx = gx - gx0

      // Bilinear interpolation of warp coordinates
      const i00 = (gy0 * gridW + gx0) * 2
      const i10 = (gy0 * gridW + gx1) * 2
      const i01 = (gy1 * gridW + gx0) * 2
      const i11 = (gy1 * gridW + gx1) * 2

      const srcX =
        (1 - fy) * ((1 - fx) * warpGrid[i00] + fx * warpGrid[i10]) +
        fy * ((1 - fx) * warpGrid[i01] + fx * warpGrid[i11])
      const srcY =
        (1 - fy) * ((1 - fx) * warpGrid[i00 + 1] + fx * warpGrid[i10 + 1]) +
        fy * ((1 - fx) * warpGrid[i01 + 1] + fx * warpGrid[i11 + 1])

      // Bilinear sampling from original image
      bilinearSample(srcData, dstData, x, y, srcX, srcY, W, H)
    }
  }

  return newData
}

/**
 * Apply skin smoothing effect to a region
 * Used to enhance procedure simulation with subtle blur + brightness
 */
export function applySkinEffect(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  intensity: number,
  simType: string
): void {
  const W = canvas.width
  const H = canvas.height

  // Expand region slightly
  const erx = rx * 1.2
  const ery = ry * 1.2

  const x1 = Math.max(0, Math.floor(cx - erx))
  const y1 = Math.max(0, Math.floor(cy - ery))
  const x2 = Math.min(W, Math.ceil(cx + erx))
  const y2 = Math.min(H, Math.ceil(cy + ery))
  const rw = x2 - x1
  const rh = y2 - y1

  if (rw <= 0 || rh <= 0) return

  // Create temporary canvas for region processing
  const region = document.createElement('canvas')
  region.width = rw
  region.height = rh
  const rctx = region.getContext('2d')
  if (!rctx) return

  // Copy region
  rctx.drawImage(canvas, x1, y1, rw, rh, 0, 0, rw, rh)

  // Apply blur
  const blurAmt = Math.round(2 + intensity * 6)
  rctx.filter = `blur(${blurAmt}px)`
  rctx.drawImage(region, 0, 0)
  rctx.filter = 'none'

  // Apply brightness based on simType
  let bright = 1
  if (simType === 'brighten') bright = 1 + 0.15 * intensity
  else if (simType === 'volume') bright = 1 + 0.05 * intensity
  else if (simType === 'smooth') bright = 1 + 0.03 * intensity

  if (bright !== 1) {
    rctx.filter = `brightness(${bright})`
    rctx.drawImage(region, 0, 0)
    rctx.filter = 'none'
  }

  // Blend with elliptical feather
  const origRegion = ctx.getImageData(x1, y1, rw, rh)
  const blurRegion = rctx.getImageData(0, 0, rw, rh)
  const localCx = cx - x1
  const localCy = cy - y1

  for (let py = 0; py < rh; py++) {
    for (let px = 0; px < rw; px++) {
      const ddx = (px - localCx) / erx
      const ddy = (py - localCy) / ery
      const dist = Math.sqrt(ddx * ddx + ddy * ddy)
      if (dist > 1) continue

      // Smooth falloff
      let blend = 1 - dist
      blend = blend * blend * (3 - 2 * blend) // smoothstep
      blend *= intensity * 0.5 // Keep subtle

      const idx = (py * rw + px) * 4
      origRegion.data[idx] = Math.round(
        origRegion.data[idx] * (1 - blend) + blurRegion.data[idx] * blend
      )
      origRegion.data[idx + 1] = Math.round(
        origRegion.data[idx + 1] * (1 - blend) + blurRegion.data[idx + 1] * blend
      )
      origRegion.data[idx + 2] = Math.round(
        origRegion.data[idx + 2] * (1 - blend) + blurRegion.data[idx + 2] * blend
      )
      origRegion.data[idx + 3] = 255
    }
  }

  ctx.putImageData(origRegion, x1, y1)
}
