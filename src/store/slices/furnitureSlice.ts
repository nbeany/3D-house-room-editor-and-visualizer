import { DEFAULT_FURNITURE, getFurnitureDef } from '../../constants/furniture'
import { uid } from '../../utils/id'
import type { FurnitureItem, FurnitureType } from '../../types'
import type { FurnitureSlice, SliceCreator } from '../types'

/** Furniture may be placed anywhere on the plot, not only inside the house. */
export const PLOT_HALF = 19

const clampToPlot = (v: number) => Math.min(PLOT_HALF, Math.max(-PLOT_HALF, v))

/**
 * Finds a reasonably free spot near the house center by walking an
 * outward spiral and rejecting candidates that collide with existing
 * furniture footprints. Used for click/tap-to-add (drag-and-drop
 * placement passes explicit coordinates instead).
 */
function findFreeSpot(existing: FurnitureItem[], type: FurnitureType): [number, number] {
  const def = getFurnitureDef(type)
  const myRadius = Math.max(def.w, def.d) / 2

  const collides = (x: number, z: number) =>
    existing.some((item) => {
      const other = getFurnitureDef(item.type)
      const otherRadius = Math.max(other.w, other.d) / 2
      return Math.hypot(item.x - x, item.z - z) < (myRadius + otherRadius) * 0.85
    })

  for (let ring = 0; ring < 10; ring++) {
    const radius = ring * 0.85
    const steps = Math.max(1, ring * 6)
    for (let s = 0; s < steps; s++) {
      const angle = (s / steps) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const z = 0.8 + Math.sin(angle) * radius
      if (!collides(x, z)) return [x, z]
    }
  }
  return [0, 0.8]
}

export const createFurnitureSlice: SliceCreator<FurnitureSlice> = (set, get) => ({
  furniture: DEFAULT_FURNITURE,
  selectedId: null,
  draggingId: null,

  select: (id) => set({ selectedId: id }),

  addFurniture: (type, x, z) => {
    get().pushHistory()
    const [fx, fz] = x === undefined || z === undefined ? findFreeSpot(get().furniture, type) : [x, z]
    const item: FurnitureItem = {
      id: uid(),
      type,
      x: clampToPlot(fx),
      z: clampToPlot(fz),
      rotY: 0,
      scale: 1,
    }
    set({ furniture: [...get().furniture, item], selectedId: item.id })
  },

  // withHistory=false during pointer drags: beginDrag() already captured the
  // pre-drag snapshot, so intermediate moves must not flood the undo stack.
  moveFurniture: (id, x, z, withHistory = false) => {
    if (withHistory) get().pushHistory()
    set({
      furniture: get().furniture.map((f) =>
        f.id === id ? { ...f, x: clampToPlot(x), z: clampToPlot(z) } : f,
      ),
    })
  },

  rotateFurniture: (id, deltaDeg) => {
    get().pushHistory()
    set({
      furniture: get().furniture.map((f) =>
        f.id === id ? { ...f, rotY: (f.rotY + deltaDeg + 360) % 360 } : f,
      ),
    })
  },

  setFurnitureScale: (id, scale) => {
    get().pushHistory()
    const s = Math.min(1.4, Math.max(0.7, scale))
    set({ furniture: get().furniture.map((f) => (f.id === id ? { ...f, scale: s } : f)) })
  },

  setFurnitureColor: (id, color) => {
    get().pushHistory()
    set({ furniture: get().furniture.map((f) => (f.id === id ? { ...f, color } : f)) })
  },

  duplicateFurniture: (id) => {
    const source = get().furniture.find((f) => f.id === id)
    if (!source) return
    get().pushHistory()
    const copy: FurnitureItem = {
      ...source,
      id: uid(),
      x: clampToPlot(source.x + 0.6),
      z: clampToPlot(source.z + 0.6),
    }
    set({ furniture: [...get().furniture, copy], selectedId: copy.id })
  },

  removeFurniture: (id) => {
    get().pushHistory()
    set({
      furniture: get().furniture.filter((f) => f.id !== id),
      selectedId: get().selectedId === id ? null : get().selectedId,
    })
  },

  beginDrag: (id) => {
    get().pushHistory()
    set({ draggingId: id, selectedId: id })
  },

  endDrag: () => set({ draggingId: null }),
})
