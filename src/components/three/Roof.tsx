import * as THREE from 'three'
import { memo } from 'react'
import { useDisposable } from '../../hooks/useDisposable'
import type { HouseSettings } from '../../types'

/* ============================================================
 * Parametric roof: flat slab, gable (extruded triangle) or hip
 * (4-sided pyramid). Gable/hip rise scales with house width so
 * proportions stay pleasant at any footprint.
 * ============================================================ */

const OVERHANG = 0.38

function buildGableGeometry(width: number, depth: number, rise: number) {
  const w = width / 2 + OVERHANG
  const d = depth + OVERHANG * 2
  const shape = new THREE.Shape()
  shape.moveTo(-w, 0)
  shape.lineTo(w, 0)
  shape.lineTo(0, rise)
  shape.closePath()
  const geo = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false })
  geo.translate(0, 0, -d / 2)
  return geo
}

function buildHipGeometry(width: number, depth: number, rise: number) {
  // A 4-segment "cylinder" closed to a point is a pyramid. Its base corners
  // sit on the axes, so rotate 45° to align the faces with the house sides;
  // corners land at (±1/√2, ±1/√2), hence the √2 factor when scaling the
  // base out to the (overhung) footprint.
  const geo = new THREE.CylinderGeometry(0.001, 1, 1, 4, 1)
  geo.rotateY(Math.PI / 4)
  geo.scale((width / 2 + OVERHANG) * Math.SQRT2, rise, (depth / 2 + OVERHANG) * Math.SQRT2)
  geo.computeVertexNormals()
  return geo
}

export const Roof = memo(function Roof({ house, material }: { house: HouseSettings; material: THREE.Material }) {
  const { width, depth, floors, floorHeight, roofType } = house
  const baseY = floors * floorHeight
  const rise = Math.max(1.2, width * 0.22)

  const gable = useDisposable(
    () => buildGableGeometry(width, depth, rise),
    [width, depth, rise],
  )
  const hip = useDisposable(
    () => buildHipGeometry(width, depth, rise * 0.85),
    [width, depth, rise],
  )

  if (roofType === 'flat') {
    return (
      <group position={[0, baseY, 0]}>
        <mesh castShadow receiveShadow material={material} position={[0, 0.12, 0]}>
          <boxGeometry args={[width + 0.5, 0.24, depth + 0.5]} />
        </mesh>
        {/* raised parapet lip */}
        <mesh castShadow position={[0, 0.3, 0]}>
          <boxGeometry args={[width + 0.5, 0.12, depth + 0.5]} />
          <meshStandardMaterial color="#8d8d89" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.31, 0]}>
          <boxGeometry args={[width + 0.1, 0.14, depth + 0.1]} />
          <meshStandardMaterial color="#6e6e6a" roughness={0.9} />
        </mesh>
      </group>
    )
  }

  if (roofType === 'gable') {
    return <mesh geometry={gable} material={material} position={[0, baseY, 0]} castShadow receiveShadow />
  }

  return (
    <mesh
      geometry={hip}
      material={material}
      position={[0, baseY + (rise * 0.85) / 2, 0]}
      castShadow
      receiveShadow
    />
  )
})
