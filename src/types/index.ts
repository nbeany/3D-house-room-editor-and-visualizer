import type { LucideIcon } from 'lucide-react'

/* ============================================================
 * Shared domain types for the whole application.
 * Everything that can be serialized (export / persistence /
 * undo history) lives here as plain JSON-friendly data.
 * ============================================================ */

/** Roof construction style. */
export type RoofType = 'flat' | 'gable' | 'hip'

/** Camera interaction modes. */
export type CameraMode = 'orbit' | 'top' | 'front' | 'firstPerson'

/** Active canvas tool. */
export type ToolMode = 'select' | 'measure'

/** UI color scheme. */
export type Theme = 'light' | 'dark'

/** Sidebar tabs. */
export type SidebarTab = 'build' | 'materials' | 'furniture' | 'effects'

/** Material categories the user can configure. */
export type MaterialCategory = 'wall' | 'floor' | 'roof'

/** A configurable PBR material option shown in the Materials panel. */
export interface MaterialDef {
  id: string
  label: string
  /** Base color used for swatches and as the material tint. */
  color: string
  roughness: number
  metalness: number
  /** Procedural texture painter id (see utils/three/proceduralTextures). */
  texture?: 'brick' | 'planks' | 'concrete' | 'stone' | 'tile' | 'marble' | 'shingles' | 'metalSeam'
  /** Cost contribution in $ per m² of floor area. */
  costPerSqm: number
}

/** The user's current material selection per category. */
export interface MaterialSelection {
  wall: string
  floor: string
  roof: string
}

/** Parametric house settings (all lengths in meters). */
export interface HouseSettings {
  width: number
  depth: number
  floors: number
  floorHeight: number
  roomsPerFloor: number
  roofType: RoofType
  showRoof: boolean
}

/** Furniture catalog entry (static data). */
export interface FurnitureDef {
  type: FurnitureType
  label: string
  category: FurnitureCategory
  price: number
  /** Footprint in meters: width (x), depth (z), height (y). */
  w: number
  d: number
  h: number
  defaultColor: string
  icon: LucideIcon
}

export type FurnitureCategory =
  | 'seating'
  | 'tables'
  | 'bedroom'
  | 'storage'
  | 'lighting'
  | 'decor'

export type FurnitureType =
  | 'sofa'
  | 'armchair'
  | 'coffeeTable'
  | 'diningTable'
  | 'chair'
  | 'bed'
  | 'wardrobe'
  | 'bookshelf'
  | 'floorLamp'
  | 'tvStand'
  | 'plant'
  | 'rug'
  | 'kitchenIsland'
  | 'desk'

/** A placed furniture instance in the scene (serializable). */
export interface FurnitureItem {
  id: string
  type: FurnitureType
  /** Position on the ground plane; y is always derived (snap-to-floor). */
  x: number
  z: number
  /** Rotation around Y in degrees. */
  rotY: number
  /** Uniform scale multiplier. */
  scale: number
  /** Optional accent color override for the primary material. */
  color?: string
}

/** Post-processing / visual quality settings. */
export interface EffectSettings {
  bloom: boolean
  ssao: boolean
  depthOfField: boolean
  vignette: boolean
  /** Real-time planar reflections on interior floors. */
  reflections: boolean
}

/** A single measurement (two points on the ground plane). */
export interface Measurement {
  id: string
  ax: number
  az: number
  bx: number
  bz: number
}

/** Snapshot of everything undo/redo tracks. */
export interface DocumentSnapshot {
  house: HouseSettings
  materials: MaterialSelection
  furniture: FurnitureItem[]
}

/** Serialized project file (JSON export). */
export interface ProjectFile {
  app: 'maison-3d'
  version: 1
  savedAt: string
  house: HouseSettings
  materials: MaterialSelection
  furniture: FurnitureItem[]
}

/** Interior wall segment computed from the room layout. */
export interface WallSegment {
  /** 'x' → wall runs along the X axis (a horizontal line in plan view). */
  axis: 'x' | 'z'
  /** Fixed coordinate: z for axis 'x', x for axis 'z'. */
  at: number
  from: number
  to: number
}

/** Rectangle of a room in plan coordinates (min/max corners). */
export interface RoomRect {
  x0: number
  z0: number
  x1: number
  z1: number
}
