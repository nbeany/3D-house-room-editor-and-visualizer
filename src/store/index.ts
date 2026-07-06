import { create } from 'zustand'
import { createCameraSlice } from './slices/cameraSlice'
import { createFurnitureSlice } from './slices/furnitureSlice'
import { createHistorySlice } from './slices/historySlice'
import { createHouseSlice } from './slices/houseSlice'
import { createMaterialsSlice } from './slices/materialsSlice'
import { createUISlice } from './slices/uiSlice'
import { loadPersisted, schedulePersist } from './persistence'
import type { ConfiguratorStore } from './types'

/**
 * The single application store, composed from focused slices.
 * Components subscribe with narrow selectors so the 3D canvas
 * never re-renders because of unrelated UI state (and vice versa).
 */
export const useStore = create<ConfiguratorStore>()((...args) => ({
  ...createHouseSlice(...args),
  ...createMaterialsSlice(...args),
  ...createFurnitureSlice(...args),
  ...createCameraSlice(...args),
  ...createUISlice(...args),
  ...createHistorySlice(...args),
}))

// Rehydrate the persisted document/preferences over the defaults…
useStore.setState(loadPersisted())

// …and keep localStorage in sync from now on (debounced inside).
useStore.subscribe(schedulePersist)

export type { ConfiguratorStore } from './types'
