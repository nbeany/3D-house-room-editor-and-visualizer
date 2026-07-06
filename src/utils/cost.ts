import { getMaterial, ROOF_COST_MULTIPLIER } from '../constants/materials'
import { getFurnitureDef } from '../constants/furniture'
import type { FurnitureItem, HouseSettings, MaterialSelection } from '../types'

/* ============================================================
 * Live cost model.
 * Structure: (wall material $/m² + floor material $/m²) × total
 * floor area × roof complexity multiplier, plus furniture prices.
 * Intentionally simple but reactive to every relevant setting.
 * ============================================================ */

export function totalFloorArea(house: HouseSettings): number {
  return house.width * house.depth * house.floors
}

export function estimateCost(
  house: HouseSettings,
  materials: MaterialSelection,
  furniture: FurnitureItem[],
): number {
  const area = totalFloorArea(house)
  const wall = getMaterial('wall', materials.wall)
  const floor = getMaterial('floor', materials.floor)
  const roof = getMaterial('roof', materials.roof)
  const roofMult = ROOF_COST_MULTIPLIER[house.roofType] ?? 1

  const structure = area * (wall.costPerSqm + floor.costPerSqm) * roofMult
  // Roof material priced on the footprint (single covering regardless of floors).
  const roofCost = house.width * house.depth * roof.costPerSqm
  const furnitureCost = furniture.reduce((sum, f) => sum + getFurnitureDef(f.type).price, 0)

  return Math.round(structure + roofCost + furnitureCost)
}
