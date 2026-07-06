import * as THREE from 'three'
import { MeshReflectorMaterial } from '@react-three/drei'
import { memo } from 'react'
import { getMaterial } from '../../constants/materials'
import { getProceduralTexture } from '../../utils/three/proceduralTextures'
import { useDisposable } from '../../hooks/useDisposable'
import { useStore } from '../../store'
import { ExteriorWalls } from './Walls'
import { InteriorWalls } from './Rooms'
import { Roof } from './Roof'
import { useHouseMaterial } from './useHouseMaterial'

/* ============================================================
 * The parametric house: floor slabs, exterior walls with
 * windows/door, interior partitions and the roof. Everything
 * rebuilds reactively from HouseSettings + material selection.
 * ============================================================ */

/**
 * Interior finished floor — optionally a real-time planar reflector.
 * The plane's UVs are rescaled to meters so the shared 1 m procedural
 * textures tile correctly without touching the (shared) texture.repeat.
 */
function FinishedFloor({ y, width, depth, reflective }: { y: number; width: number; depth: number; reflective: boolean }) {
  const floorId = useStore((s) => s.materials.floor)
  const reflections = useStore((s) => s.effects.reflections)
  const def = getMaterial('floor', floorId)
  const map = getProceduralTexture(def.texture)

  const geometry = useDisposable(() => {
    const g = new THREE.PlaneGeometry(width, depth)
    const uv = g.attributes.uv as THREE.BufferAttribute
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * width, uv.getY(i) * depth)
    return g
  }, [width, depth])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} geometry={geometry} receiveShadow>
      {reflective && reflections ? (
        <MeshReflectorMaterial
          color={def.color}
          map={map ?? undefined}
          roughness={Math.max(0.25, def.roughness - 0.15)}
          metalness={def.metalness}
          blur={[260, 90]}
          resolution={512}
          mixBlur={1}
          mixStrength={4}
          depthScale={0.6}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
          mirror={0.35}
        />
      ) : (
        <meshStandardMaterial
          color={def.color}
          map={map ?? undefined}
          roughness={def.roughness}
          metalness={def.metalness}
        />
      )}
    </mesh>
  )
}

export const House = memo(function House() {
  const house = useStore((s) => s.house)
  const wallMaterial = useHouseMaterial('wall')
  const roofMaterial = useHouseMaterial('roof')
  const { width, depth, floors, floorHeight, showRoof } = house

  return (
    <group>
      {/* foundation + ground slab (top face at y = 0) */}
      <mesh position={[0, -0.14, 0]} receiveShadow castShadow>
        <boxGeometry args={[width + 0.2, 0.28, depth + 0.2]} />
        <meshStandardMaterial color="#9a988f" roughness={0.9} />
      </mesh>

      {/* finished floors: ground level + one per upper storey */}
      <FinishedFloor y={0.02} width={width - 0.3} depth={depth - 0.3} reflective />
      {Array.from({ length: floors - 1 }, (_, i) => {
        const y = (i + 1) * floorHeight
        return (
          <group key={i}>
            {/* structural slab doubles as the ceiling below */}
            <mesh position={[0, y - 0.09, 0]} castShadow receiveShadow>
              <boxGeometry args={[width - 0.15, 0.18, depth - 0.15]} />
              <meshStandardMaterial color="#dcdad2" roughness={0.95} />
            </mesh>
            <FinishedFloor y={y + 0.005} width={width - 0.3} depth={depth - 0.3} reflective={false} />
          </group>
        )
      })}

      <ExteriorWalls house={house} material={wallMaterial} />
      <InteriorWalls house={house} />
      {showRoof && <Roof house={house} material={roofMaterial} />}

      {/* entry step in front of the door */}
      <mesh position={[0, 0.045, depth / 2 + 0.35]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.09, 0.8]} />
        <meshStandardMaterial color="#a8a5a0" roughness={0.9} />
      </mesh>
    </group>
  )
})
