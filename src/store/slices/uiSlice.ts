import type { EffectSettings, Theme } from '../../types'
import type { SliceCreator, UISlice } from '../types'

/* System preference probes — evaluated once at store creation. */
const prefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches

const prefersHighContrast = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-contrast: more)').matches

const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches

/** Touch devices start with the cheaper pipeline; everything stays user-toggleable. */
export function defaultEffects(): EffectSettings {
  const lite = isCoarsePointer()
  return {
    bloom: true,
    ssao: !lite,
    depthOfField: false,
    vignette: true,
    reflections: !lite,
  }
}

let toastSeq = 0

export const createUISlice: SliceCreator<UISlice> = (set, get) => ({
  theme: (prefersDark() ? 'dark' : 'light') as Theme,
  highContrast: prefersHighContrast(),
  tool: 'select',
  sidebarTab: 'build',
  mobilePanelOpen: false,
  minimapOpen: true,
  showGrid: true,
  snapEnabled: true,
  effects: defaultEffects(),
  measurements: [],
  pendingDrop: null,
  toast: null,
  activeModal: null,

  setTheme: (t) => set({ theme: t }),
  setHighContrast: (v) => set({ highContrast: v }),

  setTool: (t) => {
    // Switching into a tool clears selection so canvas clicks are unambiguous.
    if (t !== 'select') set({ selectedId: null })
    set({ tool: t })
  },

  setSidebarTab: (t) => set({ sidebarTab: t, mobilePanelOpen: true }),
  setMobilePanelOpen: (v) => set({ mobilePanelOpen: v }),
  toggleMinimap: () => set({ minimapOpen: !get().minimapOpen }),
  toggleGrid: () => set({ showGrid: !get().showGrid }),
  toggleSnap: () => set({ snapEnabled: !get().snapEnabled }),

  setEffect: (key, value) => set({ effects: { ...get().effects, [key]: value } }),

  addMeasurement: (m) => set({ measurements: [...get().measurements, m] }),
  clearMeasurements: () => set({ measurements: [] }),

  setPendingDrop: (d) => set({ pendingDrop: d }),

  showToast: (message) => set({ toast: { id: ++toastSeq, message } }),
  clearToast: () => set({ toast: null }),

  setActiveModal: (m) => set({ activeModal: m }),
})
