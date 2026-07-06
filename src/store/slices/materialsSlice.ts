import { DEFAULT_MATERIALS, MATERIALS_BY_CATEGORY } from '../../constants/materials'
import type { MaterialsSlice, SliceCreator } from '../types'

export const createMaterialsSlice: SliceCreator<MaterialsSlice> = (set, get) => ({
  materials: DEFAULT_MATERIALS,

  setMaterial: (category, id) => {
    // Ignore ids that don't exist in the catalog (bad import, stale persistence).
    if (!MATERIALS_BY_CATEGORY[category].some((m) => m.id === id)) return
    get().pushHistory()
    set({ materials: { ...get().materials, [category]: id } })
  },
})
