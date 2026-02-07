/**
 * Warp Strategies - Displacement calculations per procedure type
 * Each simulation type (smooth, lift, volume, etc.) has different
 * landmark displacement behaviors
 */

import { MLSPoint } from './mls-engine'
import { ZONE_DEFS, ZoneDef, SimType } from './zone-definitions'

/**
 * MediaPipe normalized landmark (0-1 range)
 */
export interface NormalizedLandmark {
  x: number
  y: number
  z: number
}

/**
 * Runtime zone state with current region position
 */
export interface ZoneState {
  id: string
  simType: SimType
  simRegion: {
    cx: number  // Normalized center X (0-1)
    cy: number  // Normalized center Y (0-1)
    rx: number  // Normalized radius X
    ry: number  // Normalized radius Y
  }
}

/**
 * Procedure data for simulation
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
  intensity: number  // 0-100
  notes?: string
}

/**
 * Warp control points result
 */
export interface WarpPoints {
  from: MLSPoint[]
  to: MLSPoint[]
}

/**
 * Calculate warp displacement vectors for a specific procedure
 * Based on the zone's simulation type and procedure intensity
 *
 * @param zoneId - Zone identifier
 * @param zone - Runtime zone state
 * @param proc - Procedure data
 * @param landmarks - Detected face landmarks (468 points)
 * @param W - Image width
 * @param H - Image height
 * @returns Control points for MLS warping
 */
export function getWarpDisplacements(
  zoneId: string,
  zone: ZoneState,
  proc: ProcedureData,
  landmarks: NormalizedLandmark[] | null,
  W: number,
  H: number
): WarpPoints {
  if (!landmarks) return { from: [], to: [] }

  const zoneDef = ZONE_DEFS.find(z => z.id === zoneId)
  if (!zoneDef || zoneDef.landmarks.length === 0) {
    return { from: [], to: [] }
  }

  const intensity = (proc.intensity || 70) / 100
  const st = zone.simType
  const r = zone.simRegion

  // Zone center in pixels
  const cx = r.cx * W
  const cy = r.cy * H

  const from: MLSPoint[] = []
  const to: MLSPoint[] = []

  // Process each landmark in the zone
  zoneDef.landmarks.forEach(idx => {
    if (idx >= landmarks.length) return

    const lm = landmarks[idx]
    const px = lm.x * W
    const py = lm.y * H

    // Calculate displacement based on simulation type
    let dx = 0, dy = 0
    const distFromCenter = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2)
    const maxDist = Math.max(r.rx * W, r.ry * H)
    const falloff = Math.max(0, 1 - distFromCenter / (maxDist * 1.5))

    // Displacement magnitude scales with intensity and zone size
    const mag = intensity * maxDist * 0.35

    switch (st) {
      case 'smooth':
        // Botox/smoothing: slight pull toward center
        dx = (cx - px) * 0.08 * intensity * falloff
        dy = (cy - py) * 0.08 * intensity * falloff
        break

      case 'lift':
        // Fios/lifting: pull upward
        dx = 0
        dy = -mag * 0.6 * falloff
        break

      case 'volume':
        // Filler/volume: push outward from center (inflate)
        if (distFromCenter > 1) {
          const nx = (px - cx) / distFromCenter
          const ny = (py - cy) / distFromCenter
          dx = nx * mag * 0.4 * falloff
          dy = ny * mag * 0.4 * falloff
        }
        break

      case 'brighten':
        // Under-eye: slight upward + outward
        dx = (px - cx) * 0.05 * intensity * falloff
        dy = -mag * 0.2 * falloff
        break

      case 'contour':
        // Nose/Jaw contouring: pull inward (narrow)
        if (distFromCenter > 1) {
          const nx = (cx - px) / distFromCenter
          dx = nx * mag * 0.3 * falloff
          dy = 0
        }
        break

      case 'slim':
        // Masseter/Papada slimming: pull inward strongly
        if (distFromCenter > 1) {
          const nx = (cx - px) / distFromCenter
          const ny = (cy - py) / distFromCenter
          dx = nx * mag * 0.5 * falloff
          dy = ny * mag * 0.15 * falloff
        }
        break
    }

    from.push(new MLSPoint(px, py))
    to.push(new MLSPoint(px + dx, py + dy))
  })

  // Add anchor points around image edges to prevent global distortion
  const step = 40
  for (let x = 0; x <= W; x += step) {
    from.push(new MLSPoint(x, 0))
    to.push(new MLSPoint(x, 0))
    from.push(new MLSPoint(x, H))
    to.push(new MLSPoint(x, H))
  }
  for (let y = step; y < H; y += step) {
    from.push(new MLSPoint(0, y))
    to.push(new MLSPoint(0, y))
    from.push(new MLSPoint(W, y))
    to.push(new MLSPoint(W, y))
  }

  return { from, to }
}

/**
 * Collect warp points from all procedures
 * Combines displacement from multiple zones into a single set of control points
 *
 * @param procedures - All active procedures
 * @param zones - Runtime zone states
 * @param landmarks - Detected face landmarks
 * @param W - Image width
 * @param H - Image height
 * @returns Combined control points for MLS warping
 */
export function collectAllWarpPoints(
  procedures: Record<string, ProcedureData>,
  zones: Record<string, ZoneState>,
  landmarks: NormalizedLandmark[] | null,
  W: number,
  H: number
): WarpPoints {
  let allFrom: MLSPoint[] = []
  let allTo: MLSPoint[] = []

  Object.entries(procedures).forEach(([zoneId, proc]) => {
    const zone = zones[zoneId]
    if (!zone) return

    const { from, to } = getWarpDisplacements(zoneId, zone, proc, landmarks, W, H)
    allFrom = allFrom.concat(from)
    allTo = allTo.concat(to)
  })

  return { from: allFrom, to: allTo }
}

/**
 * Initialize runtime zones from zone definitions
 * Creates a mutable copy with simRegion for each zone
 */
export function initializeZones(): Record<string, ZoneState> {
  const zones: Record<string, ZoneState> = {}

  ZONE_DEFS.forEach(zdef => {
    zones[zdef.id] = {
      id: zdef.id,
      simType: zdef.simType,
      simRegion: {
        cx: zdef.cx,
        cy: zdef.cy,
        rx: zdef.rx,
        ry: zdef.ry
      }
    }
  })

  return zones
}

/**
 * Align zones to detected landmarks
 * Adjusts zone positions based on actual face position in the image
 *
 * @param zones - Runtime zone states to update
 * @param landmarks - Detected face landmarks
 */
export function alignZonesToLandmarks(
  zones: Record<string, ZoneState>,
  landmarks: NormalizedLandmark[]
): void {
  ZONE_DEFS.forEach(zdef => {
    if (!zdef.landmarks || zdef.landmarks.length === 0) return

    const zone = zones[zdef.id]
    if (!zone) return

    // Calculate centroid and bounding box from landmarks
    let sumX = 0, sumY = 0
    let minX = 1, maxX = 0, minY = 1, maxY = 0
    let validCount = 0

    zdef.landmarks.forEach(idx => {
      if (idx < landmarks.length) {
        const lm = landmarks[idx]
        sumX += lm.x
        sumY += lm.y
        minX = Math.min(minX, lm.x)
        maxX = Math.max(maxX, lm.x)
        minY = Math.min(minY, lm.y)
        maxY = Math.max(maxY, lm.y)
        validCount++
      }
    })

    if (validCount > 0) {
      zone.simRegion.cx = sumX / validCount
      zone.simRegion.cy = sumY / validCount

      // Set rx/ry based on bounding box with tighter fit
      const rangeX = (maxX - minX) / 2
      const rangeY = (maxY - minY) / 2

      if (rangeX > 0.005) {
        zone.simRegion.rx = rangeX * 0.9
        if (zdef.maxRx) {
          zone.simRegion.rx = Math.min(zone.simRegion.rx, zdef.maxRx)
        }
      }
      if (rangeY > 0.005) {
        zone.simRegion.ry = rangeY * 0.9
        if (zdef.maxRy) {
          zone.simRegion.ry = Math.min(zone.simRegion.ry, zdef.maxRy)
        }
      }
    }
  })
}

/**
 * Reset all zones to their default positions
 */
export function resetZonesToDefaults(zones: Record<string, ZoneState>): void {
  ZONE_DEFS.forEach(zdef => {
    const zone = zones[zdef.id]
    if (zone) {
      zone.simRegion.cx = zdef.cx
      zone.simRegion.cy = zdef.cy
      zone.simRegion.rx = zdef.rx
      zone.simRegion.ry = zdef.ry
    }
  })
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Update zone position (for reposition mode)
 */
export function updateZonePosition(
  zone: ZoneState,
  dx: number,
  dy: number
): void {
  zone.simRegion.cx = clamp(zone.simRegion.cx + dx, 0.02, 0.98)
  zone.simRegion.cy = clamp(zone.simRegion.cy + dy, 0.02, 0.98)
}

/**
 * Update zone size (for reposition mode)
 */
export function updateZoneSize(
  zone: ZoneState,
  drx: number,
  dry: number
): void {
  zone.simRegion.rx = clamp(zone.simRegion.rx + drx, 0.008, 0.25)
  zone.simRegion.ry = clamp(zone.simRegion.ry + dry, 0.005, 0.25)
}
