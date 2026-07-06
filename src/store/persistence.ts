import type { ConfiguratorStore } from './types'
import { sanitizeHouse } from './slices/houseSlice'
import { defaultEffects } from './slices/uiSlice'

/* ============================================================
 * Manual localStorage persistence.
 * Deliberately explicit (instead of zustand/persist middleware):
 * only the durable document + preferences are stored — never
 * selection, drag state or undo history.
 * ============================================================ */

const STORAGE_KEY = 'maison3d:v1'
const SAVE_DEBOUNCE_MS = 600

type Persisted = Pick<
  ConfiguratorStore,
  | 'house'
  | 'materials'
  | 'furniture'
  | 'theme'
  | 'highContrast'
  | 'effects'
  | 'showGrid'
  | 'snapEnabled'
  | 'minimapOpen'
>

export function loadPersisted(): Partial<Persisted> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw) as Partial<Persisted>
    if (data.house) data.house = sanitizeHouse(data.house)
    if (!Array.isArray(data.furniture)) delete data.furniture
    // Merge over defaults so effect keys added in future versions never load as undefined.
    if (data.effects) data.effects = { ...defaultEffects(), ...data.effects }
    return data
  } catch {
    return {} // corrupted storage should never block the app
  }
}

function pick(s: ConfiguratorStore): Persisted {
  return {
    house: s.house,
    materials: s.materials,
    furniture: s.furniture,
    theme: s.theme,
    highContrast: s.highContrast,
    effects: s.effects,
    showGrid: s.showGrid,
    snapEnabled: s.snapEnabled,
    minimapOpen: s.minimapOpen,
  }
}

let timer: ReturnType<typeof setTimeout> | undefined

/** Debounced save — subscribe this to the store (see store/index.ts). */
export function schedulePersist(state: ConfiguratorStore): void {
  clearTimeout(timer)
  timer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pick(state)))
    } catch {
      /* storage full / private mode — persistence is best-effort */
    }
  }, SAVE_DEBOUNCE_MS)
}
