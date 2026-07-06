import * as THREE from 'three'
import { getMaterial } from '../../constants/materials'
import { getProceduralTexture } from '../../utils/three/proceduralTextures'
import { useDisposable } from '../../hooks/useDisposable'
import { useStore } from '../../store'
import type { MaterialCategory } from '../../types'

/**
 * Shared PBR material for a configurable category (wall/floor/roof).
 * One material instance per category — every wall of every floor reuses
 * it, which keeps draw-state changes minimal. Procedural textures are
 * cached globally and must NOT be disposed with the material.
 */
export function useHouseMaterial(category: MaterialCategory): THREE.MeshStandardMaterial {
  const id = useStore((s) => s.materials[category])
  const def = getMaterial(category, id)

  return useDisposable(() => {
    const map = getProceduralTexture(def.texture)
    return new THREE.MeshStandardMaterial({
      color: def.color,
      roughness: def.roughness,
      metalness: def.metalness,
      map: map ?? null,
    })
  }, [def.id])
}
