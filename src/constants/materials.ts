import type { MaterialDef, MaterialSelection } from '../types'

/* ============================================================
 * Material catalogs.
 * costPerSqm feeds the live cost estimate (per m² of floor area);
 * texture ids map to procedural CanvasTextures — the app ships
 * with zero binary assets and still looks rich.
 * ============================================================ */

export const WALL_MATERIALS: MaterialDef[] = [
  { id: 'stucco', label: 'Warm Stucco', color: '#e8e2d6', roughness: 0.95, metalness: 0, costPerSqm: 430 },
  { id: 'brick', label: 'Classic Brick', color: '#b0604a', roughness: 0.9, metalness: 0, texture: 'brick', costPerSqm: 520 },
  { id: 'woodSiding', label: 'Cedar Siding', color: '#a9805a', roughness: 0.8, metalness: 0, texture: 'planks', costPerSqm: 480 },
  { id: 'concrete', label: 'Cast Concrete', color: '#b9b9b6', roughness: 0.85, metalness: 0.05, texture: 'concrete', costPerSqm: 560 },
  { id: 'stone', label: 'Natural Stone', color: '#9d968a', roughness: 0.92, metalness: 0, texture: 'stone', costPerSqm: 640 },
  { id: 'graphite', label: 'Graphite Panel', color: '#3f4247', roughness: 0.6, metalness: 0.2, costPerSqm: 590 },
]

export const FLOOR_MATERIALS: MaterialDef[] = [
  { id: 'oak', label: 'Oak Parquet', color: '#c49a6c', roughness: 0.55, metalness: 0, texture: 'planks', costPerSqm: 85 },
  { id: 'walnut', label: 'Dark Walnut', color: '#6e4f37', roughness: 0.5, metalness: 0, texture: 'planks', costPerSqm: 110 },
  { id: 'tile', label: 'Porcelain Tile', color: '#d8d5ce', roughness: 0.35, metalness: 0, texture: 'tile', costPerSqm: 60 },
  { id: 'polishedConcrete', label: 'Polished Concrete', color: '#a8a8a4', roughness: 0.3, metalness: 0.08, texture: 'concrete', costPerSqm: 55 },
  { id: 'marble', label: 'Carrara Marble', color: '#e9e7e2', roughness: 0.18, metalness: 0.02, texture: 'marble', costPerSqm: 160 },
]

export const ROOF_MATERIALS: MaterialDef[] = [
  { id: 'shingle', label: 'Asphalt Shingle', color: '#4a4a4e', roughness: 0.95, metalness: 0, texture: 'shingles', costPerSqm: 45 },
  { id: 'terracotta', label: 'Terracotta', color: '#b2593c', roughness: 0.85, metalness: 0, texture: 'shingles', costPerSqm: 70 },
  { id: 'slate', label: 'Slate Grey', color: '#3a4046', roughness: 0.7, metalness: 0.1, texture: 'shingles', costPerSqm: 95 },
  { id: 'metalSeam', label: 'Standing Seam', color: '#7c8288', roughness: 0.4, metalness: 0.65, texture: 'metalSeam', costPerSqm: 80 },
]

export const MATERIALS_BY_CATEGORY = {
  wall: WALL_MATERIALS,
  floor: FLOOR_MATERIALS,
  roof: ROOF_MATERIALS,
} as const

/** Look up a material definition, falling back to the first of its category. */
export function getMaterial(category: keyof typeof MATERIALS_BY_CATEGORY, id: string): MaterialDef {
  const list = MATERIALS_BY_CATEGORY[category]
  return list.find((m) => m.id === id) ?? list[0]
}

export const DEFAULT_MATERIALS: MaterialSelection = {
  wall: 'stucco',
  floor: 'oak',
  roof: 'shingle',
}

/** Roof complexity multiplier applied to the structural cost. */
export const ROOF_COST_MULTIPLIER: Record<string, number> = {
  flat: 1.0,
  gable: 1.08,
  hip: 1.15,
}
