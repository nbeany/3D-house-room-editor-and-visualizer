import * as THREE from 'three'

const raycaster = new THREE.Raycaster()
const ndc = new THREE.Vector2()

/**
 * Intersects an arbitrary ray with the ground plane (y = 0).
 * Returns null when the ray is parallel to / pointing away from the plane.
 */
export function rayToGround(ray: THREE.Ray): [number, number] | null {
  if (Math.abs(ray.direction.y) < 1e-6) return null
  const t = -ray.origin.y / ray.direction.y
  if (t < 0) return null
  const x = ray.origin.x + ray.direction.x * t
  const z = ray.origin.z + ray.direction.z * t
  return [x, z]
}

/**
 * Converts normalized device coordinates (-1..1) into a point on the ground
 * plane using the given camera. Used for drag-and-drop from the catalog.
 */
export function ndcToGround(x: number, y: number, camera: THREE.Camera): [number, number] | null {
  ndc.set(x, y)
  raycaster.setFromCamera(ndc, camera)
  return rayToGround(raycaster.ray)
}

/** Snaps a value to a grid step; pass step <= 0 to disable. */
export function snap(value: number, step: number): number {
  if (step <= 0) return value
  return Math.round(value / step) * step
}
