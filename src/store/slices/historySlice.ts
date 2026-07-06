import { DEFAULT_FURNITURE } from '../../constants/furniture'
import { DEFAULT_MATERIALS } from '../../constants/materials'
import type { DocumentSnapshot } from '../../types'
import { DEFAULT_HOUSE } from './houseSlice'
import type { ConfiguratorStore, HistorySlice, SliceCreator } from '../types'

/* ============================================================
 * Undo / redo.
 * Mutating actions call pushHistory() BEFORE changing state, so
 * the stack always holds the state to return to. Pushes within a
 * short window are coalesced — dragging a slider produces one
 * undo step, not sixty.
 * ============================================================ */

const MAX_HISTORY = 60
const COALESCE_MS = 400

function takeSnapshot(s: ConfiguratorStore): DocumentSnapshot {
  return structuredClone({ house: s.house, materials: s.materials, furniture: s.furniture })
}

export const createHistorySlice: SliceCreator<HistorySlice> = (set, get) => ({
  past: [],
  future: [],
  lastPushAt: 0,

  pushHistory: () => {
    const s = get()
    const now = Date.now()
    // Any new edit invalidates the redo stack, even a coalesced one.
    if (now - s.lastPushAt < COALESCE_MS) {
      if (s.future.length) set({ future: [] })
      return
    }
    set({
      past: [...s.past.slice(-(MAX_HISTORY - 1)), takeSnapshot(s)],
      future: [],
      lastPushAt: now,
    })
  },

  undo: () => {
    const s = get()
    const previous = s.past[s.past.length - 1]
    if (!previous) return
    set({
      past: s.past.slice(0, -1),
      future: [...s.future, takeSnapshot(s)],
      lastPushAt: 0,
      house: previous.house,
      materials: previous.materials,
      furniture: previous.furniture,
      selectedId: null,
    })
  },

  redo: () => {
    const s = get()
    const next = s.future[s.future.length - 1]
    if (!next) return
    set({
      future: s.future.slice(0, -1),
      past: [...s.past, takeSnapshot(s)],
      lastPushAt: 0,
      house: next.house,
      materials: next.materials,
      furniture: next.furniture,
      selectedId: null,
    })
  },

  // Reset is itself undoable — no scary confirm dialog needed.
  resetProject: () => {
    get().pushHistory()
    set({
      house: structuredClone(DEFAULT_HOUSE),
      materials: structuredClone(DEFAULT_MATERIALS),
      furniture: structuredClone(DEFAULT_FURNITURE),
      selectedId: null,
      measurements: [],
      lastPushAt: 0,
    })
  },
})
