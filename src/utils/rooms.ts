import type { RoomRect, WallSegment } from '../types'

/* ============================================================
 * Procedural room layout.
 * Recursively splits the house footprint into `count` rooms with
 * a simple BSP: always split along the longer axis, proportionally
 * to how many rooms each half must contain. Deterministic — the
 * same inputs always produce the same floor plan, which keeps
 * undo/redo, the minimap and interior walls in sync for free.
 * ============================================================ */

export interface RoomLayout {
  rooms: RoomRect[]
  walls: WallSegment[]
}

/** Width of the gap left in interior walls as a doorway. */
export const DOORWAY_WIDTH = 1.0

export function computeRoomLayout(width: number, depth: number, count: number): RoomLayout {
  const rooms: RoomRect[] = []
  const walls: WallSegment[] = []

  const split = (rect: RoomRect, n: number) => {
    if (n <= 1) {
      rooms.push(rect)
      return
    }
    const w = rect.x1 - rect.x0
    const d = rect.z1 - rect.z0
    const nFirst = Math.ceil(n / 2)
    const t = nFirst / n

    if (w >= d) {
      // Vertical split line at x = at → the wall runs along the Z axis.
      const at = rect.x0 + w * t
      walls.push({ axis: 'z', at, from: rect.z0, to: rect.z1 })
      split({ ...rect, x1: at }, nFirst)
      split({ ...rect, x0: at }, n - nFirst)
    } else {
      // Horizontal split line at z = at → the wall runs along the X axis.
      const at = rect.z0 + d * t
      walls.push({ axis: 'x', at, from: rect.x0, to: rect.x1 })
      split({ ...rect, z1: at }, nFirst)
      split({ ...rect, z0: at }, n - nFirst)
    }
  }

  split({ x0: -width / 2, z0: -depth / 2, x1: width / 2, z1: depth / 2 }, Math.max(1, Math.round(count)))
  return { rooms, walls }
}

/**
 * Splits a wall segment into solid pieces, leaving a centered doorway gap.
 * Returns [from, to] intervals along the segment's running axis.
 */
export function wallPiecesWithDoorway(seg: WallSegment): [number, number][] {
  const len = seg.to - seg.from
  if (len <= DOORWAY_WIDTH + 0.4) return [[seg.from, seg.to]] // too short for a door
  const mid = (seg.from + seg.to) / 2
  return [
    [seg.from, mid - DOORWAY_WIDTH / 2],
    [mid + DOORWAY_WIDTH / 2, seg.to],
  ]
}
