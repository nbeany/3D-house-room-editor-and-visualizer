import type { HouseSettings } from '../../types'
import type { HouseSlice, SliceCreator } from '../types'

export const HOUSE_LIMITS = {
  width: { min: 7, max: 20, step: 0.5 },
  depth: { min: 6, max: 16, step: 0.5 },
  floors: { min: 1, max: 3, step: 1 },
  floorHeight: { min: 2.4, max: 3.6, step: 0.1 },
  roomsPerFloor: { min: 1, max: 6, step: 1 },
} as const

export const DEFAULT_HOUSE: HouseSettings = {
  width: 12,
  depth: 9,
  floors: 1,
  floorHeight: 2.9,
  roomsPerFloor: 3,
  roofType: 'gable',
  showRoof: true,
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/** Clamps numeric house settings into their valid ranges (defensive against bad imports). */
export function sanitizeHouse(h: HouseSettings): HouseSettings {
  return {
    ...h,
    width: clamp(h.width, HOUSE_LIMITS.width.min, HOUSE_LIMITS.width.max),
    depth: clamp(h.depth, HOUSE_LIMITS.depth.min, HOUSE_LIMITS.depth.max),
    floors: Math.round(clamp(h.floors, HOUSE_LIMITS.floors.min, HOUSE_LIMITS.floors.max)),
    floorHeight: clamp(h.floorHeight, HOUSE_LIMITS.floorHeight.min, HOUSE_LIMITS.floorHeight.max),
    roomsPerFloor: Math.round(
      clamp(h.roomsPerFloor, HOUSE_LIMITS.roomsPerFloor.min, HOUSE_LIMITS.roomsPerFloor.max),
    ),
  }
}

export const createHouseSlice: SliceCreator<HouseSlice> = (set, get) => ({
  house: DEFAULT_HOUSE,

  setHouse: (patch) => {
    get().pushHistory()
    set({ house: sanitizeHouse({ ...get().house, ...patch }) })
  },
})
