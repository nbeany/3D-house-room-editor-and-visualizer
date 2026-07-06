import type { StateCreator } from 'zustand'
import type {
  CameraMode,
  DocumentSnapshot,
  EffectSettings,
  FurnitureItem,
  FurnitureType,
  HouseSettings,
  MaterialCategory,
  MaterialSelection,
  Measurement,
  SidebarTab,
  Theme,
  ToolMode,
} from '../types'

/* ============================================================
 * Store contracts. The store is composed from six slices — one
 * concern each — combined into a single Zustand store so any
 * component can select exactly the state it needs.
 * ============================================================ */

export interface HouseSlice {
  house: HouseSettings
  setHouse: (patch: Partial<HouseSettings>) => void
}

export interface MaterialsSlice {
  materials: MaterialSelection
  setMaterial: (category: MaterialCategory, id: string) => void
}

export interface FurnitureSlice {
  furniture: FurnitureItem[]
  selectedId: string | null
  draggingId: string | null
  select: (id: string | null) => void
  addFurniture: (type: FurnitureType, x?: number, z?: number) => void
  moveFurniture: (id: string, x: number, z: number, withHistory?: boolean) => void
  rotateFurniture: (id: string, deltaDeg: number) => void
  setFurnitureScale: (id: string, scale: number) => void
  setFurnitureColor: (id: string, color: string | undefined) => void
  duplicateFurniture: (id: string) => void
  removeFurniture: (id: string) => void
  beginDrag: (id: string) => void
  endDrag: () => void
}

export interface CameraSlice {
  cameraMode: CameraMode
  autoRotate: boolean
  /** True while pointer-lock is engaged in first-person mode. */
  fpLocked: boolean
  /** Camera position/heading mirrored at ~10 Hz for the minimap. */
  liveCam: { x: number; z: number; heading: number }
  setCameraMode: (mode: CameraMode) => void
  setAutoRotate: (v: boolean) => void
  setFpLocked: (v: boolean) => void
  setLiveCam: (x: number, z: number, heading: number) => void
}

export interface UISlice {
  theme: Theme
  highContrast: boolean
  tool: ToolMode
  sidebarTab: SidebarTab
  /** Overlay panel visibility on tablet / bottom sheet on mobile. */
  mobilePanelOpen: boolean
  minimapOpen: boolean
  showGrid: boolean
  snapEnabled: boolean
  effects: EffectSettings
  measurements: Measurement[]
  /** Catalog item dropped onto the canvas, waiting to be raycast-placed. */
  pendingDrop: { type: FurnitureType; ndcX: number; ndcY: number } | null
  toast: { id: number; message: string } | null
  activeModal: 'shortcuts' | null
  setTheme: (t: Theme) => void
  setHighContrast: (v: boolean) => void
  setTool: (t: ToolMode) => void
  setSidebarTab: (t: SidebarTab) => void
  setMobilePanelOpen: (v: boolean) => void
  toggleMinimap: () => void
  toggleGrid: () => void
  toggleSnap: () => void
  setEffect: (key: keyof EffectSettings, value: boolean) => void
  addMeasurement: (m: Measurement) => void
  clearMeasurements: () => void
  setPendingDrop: (d: UISlice['pendingDrop']) => void
  showToast: (message: string) => void
  clearToast: () => void
  setActiveModal: (m: UISlice['activeModal']) => void
}

export interface HistorySlice {
  past: DocumentSnapshot[]
  future: DocumentSnapshot[]
  /** Timestamp of the last history push — used to coalesce slider drags. */
  lastPushAt: number
  pushHistory: () => void
  undo: () => void
  redo: () => void
  resetProject: () => void
}

export interface ConfiguratorStore
  extends HouseSlice,
    MaterialsSlice,
    FurnitureSlice,
    CameraSlice,
    UISlice,
    HistorySlice {}

/** Convenience alias for slice creators. */
export type SliceCreator<T> = StateCreator<ConfiguratorStore, [], [], T>
