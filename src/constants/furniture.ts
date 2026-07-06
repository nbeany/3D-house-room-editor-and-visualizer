import {
  Armchair,
  BedDouble,
  BookOpen,
  ChefHat,
  DoorClosed,
  Flower2,
  Lamp,
  Laptop,
  RectangleHorizontal,
  RockingChair,
  Sofa,
  Table,
  Table2,
  Tv,
} from 'lucide-react'
import type { FurnitureDef, FurnitureItem, FurnitureType } from '../types'

/* ============================================================
 * Furniture catalog. Every model is generated procedurally from
 * primitives (see components/three/models) so the app runs with
 * zero downloaded assets; footprints drive selection rings,
 * minimap dots and the drag bounds.
 * ============================================================ */

export const FURNITURE_CATALOG: FurnitureDef[] = [
  { type: 'sofa', label: '3-Seat Sofa', category: 'seating', price: 1299, w: 2.1, d: 0.95, h: 0.8, defaultColor: '#8a93a6', icon: Sofa },
  { type: 'armchair', label: 'Lounge Chair', category: 'seating', price: 549, w: 0.9, d: 0.9, h: 0.75, defaultColor: '#c2a284', icon: RockingChair },
  { type: 'chair', label: 'Dining Chair', category: 'seating', price: 189, w: 0.5, d: 0.52, h: 0.85, defaultColor: '#4a4d55', icon: Armchair },
  { type: 'coffeeTable', label: 'Coffee Table', category: 'tables', price: 329, w: 1.1, d: 0.6, h: 0.42, defaultColor: '#8a6b4d', icon: Table2 },
  { type: 'diningTable', label: 'Dining Table', category: 'tables', price: 899, w: 1.8, d: 0.95, h: 0.75, defaultColor: '#9a7a56', icon: Table },
  { type: 'desk', label: 'Work Desk', category: 'tables', price: 699, w: 1.4, d: 0.7, h: 0.76, defaultColor: '#b08d64', icon: Laptop },
  { type: 'bed', label: 'Queen Bed', category: 'bedroom', price: 1499, w: 1.7, d: 2.1, h: 0.95, defaultColor: '#aab4c4', icon: BedDouble },
  { type: 'wardrobe', label: 'Wardrobe', category: 'bedroom', price: 1099, w: 1.6, d: 0.65, h: 2.1, defaultColor: '#d8d3c8', icon: DoorClosed },
  { type: 'bookshelf', label: 'Bookshelf', category: 'storage', price: 449, w: 0.9, d: 0.35, h: 1.9, defaultColor: '#7d5f43', icon: BookOpen },
  { type: 'tvStand', label: 'Media Console', category: 'storage', price: 599, w: 1.6, d: 0.45, h: 0.5, defaultColor: '#5b4a38', icon: Tv },
  { type: 'kitchenIsland', label: 'Kitchen Island', category: 'storage', price: 1899, w: 1.8, d: 0.9, h: 0.95, defaultColor: '#e2e0da', icon: ChefHat },
  { type: 'floorLamp', label: 'Arc Floor Lamp', category: 'lighting', price: 179, w: 0.45, d: 0.45, h: 1.65, defaultColor: '#2e2e30', icon: Lamp },
  { type: 'plant', label: 'Potted Plant', category: 'decor', price: 89, w: 0.5, d: 0.5, h: 1.25, defaultColor: '#4c7a4f', icon: Flower2 },
  { type: 'rug', label: 'Area Rug', category: 'decor', price: 259, w: 2.4, d: 1.7, h: 0.02, defaultColor: '#b9a58e', icon: RectangleHorizontal },
]

const byType = new Map(FURNITURE_CATALOG.map((f) => [f.type, f]))

export function getFurnitureDef(type: FurnitureType): FurnitureDef {
  const def = byType.get(type)
  if (!def) throw new Error(`Unknown furniture type: ${type}`)
  return def
}

export const FURNITURE_CATEGORIES: { id: FurnitureDef['category']; label: string }[] = [
  { id: 'seating', label: 'Seating' },
  { id: 'tables', label: 'Tables' },
  { id: 'bedroom', label: 'Bedroom' },
  { id: 'storage', label: 'Storage' },
  { id: 'lighting', label: 'Lighting' },
  { id: 'decor', label: 'Decor' },
]

/** Accent colors offered in the inspector for recoloring furniture. */
export const FURNITURE_COLORS = [
  '#8a93a6', '#c2a284', '#4c7a4f', '#a65d57', '#4a6e8a', '#3a3a3e', '#d8d3c8', '#b08d64',
]

/**
 * Starter scene — a tastefully furnished single-floor home so the first
 * impression is a finished product, not an empty lot. Positions assume the
 * default 12 × 9 m footprint with 3 rooms (living front-left, bedroom
 * back-left, dining right).
 */
export const DEFAULT_FURNITURE: FurnitureItem[] = [
  { id: 'seed-rug', type: 'rug', x: -3, z: 2.6, rotY: 0, scale: 1 },
  { id: 'seed-sofa', type: 'sofa', x: -3, z: 1.7, rotY: 0, scale: 1 },
  { id: 'seed-coffee', type: 'coffeeTable', x: -3, z: 3.0, rotY: 0, scale: 1 },
  { id: 'seed-tv', type: 'tvStand', x: -3, z: 4.05, rotY: 180, scale: 1 },
  { id: 'seed-lamp', type: 'floorLamp', x: -5.2, z: 3.7, rotY: 30, scale: 1 },
  { id: 'seed-plant', type: 'plant', x: -1.3, z: 3.9, rotY: 0, scale: 1 },
  { id: 'seed-bed', type: 'bed', x: -3.2, z: -2.6, rotY: 0, scale: 1 },
  { id: 'seed-wardrobe', type: 'wardrobe', x: -5.5, z: -2.4, rotY: 90, scale: 1 },
  { id: 'seed-dining', type: 'diningTable', x: 4, z: 0.6, rotY: 90, scale: 1 },
  { id: 'seed-chair-1', type: 'chair', x: 3.2, z: 0.6, rotY: 90, scale: 1 },
  { id: 'seed-chair-2', type: 'chair', x: 4.8, z: 0.6, rotY: -90, scale: 1 },
  { id: 'seed-shelf', type: 'bookshelf', x: 5.6, z: -3.4, rotY: -90, scale: 1 },
]
