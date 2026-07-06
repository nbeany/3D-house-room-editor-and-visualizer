import * as THREE from 'three'
import { memo } from 'react'
import { useDisposable } from '../../hooks/useDisposable'
import type { HouseSettings } from '../../types'

/* ============================================================
 * Exterior walls.
 * Each wall is a THREE.Shape (rectangle) with rectangular holes
 * punched for windows/doors, extruded to wall thickness. Shape
 * coordinates are in meters, so the extrude UVs tile the
 * procedural material textures 1:1 without any UV massaging.
 * ============================================================ */

export const WALL_THICKNESS = 0.25

interface Opening {
  x: number // center along the wall, local coords
  w: number
  sill: number // bottom height above the floor
  h: number
  kind: 'window' | 'door'
}

/** Procedurally distributes windows (and the entry door on the front ground wall). */
function computeOpenings(len: number, floorHeight: number, withDoor: boolean): Opening[] {
  const openings: Opening[] = []
  const door: Opening | null = withDoor
    ? { x: 0, w: 1.1, sill: 0, h: Math.min(2.15, floorHeight - 0.4), kind: 'door' }
    : null
  if (door) openings.push(door)

  const usable = len - 1.6 // symmetric side margins
  const count = Math.max(usable > 1.6 ? 1 : 0, Math.floor(usable / 2.4))
  const winW = Math.min(1.3, usable / Math.max(count, 1) - 0.6)
  const sill = 0.95
  const winH = Math.min(1.35, floorHeight - sill - 0.35)
  if (winH < 0.4 || winW < 0.5) return openings

  for (let i = 0; i < count; i++) {
    const x = -usable / 2 + ((i + 0.5) * usable) / count
    // Keep clear of the door.
    if (door && Math.abs(x - door.x) < door.w / 2 + winW / 2 + 0.35) continue
    openings.push({ x, w: winW, sill, h: winH, kind: 'window' })
  }
  return openings
}

function buildWallGeometry(len: number, height: number, thickness: number, openings: Opening[]) {
  const shape = new THREE.Shape()
  shape.moveTo(-len / 2, 0)
  shape.lineTo(len / 2, 0)
  shape.lineTo(len / 2, height)
  shape.lineTo(-len / 2, height)
  shape.closePath()

  for (const o of openings) {
    const hole = new THREE.Path()
    hole.moveTo(o.x - o.w / 2, o.sill)
    hole.lineTo(o.x + o.w / 2, o.sill)
    hole.lineTo(o.x + o.w / 2, o.sill + o.h)
    hole.lineTo(o.x - o.w / 2, o.sill + o.h)
    hole.closePath()
    shape.holes.push(hole)
  }

  const geo = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false })
  geo.translate(0, 0, -thickness / 2) // center on the wall plane
  return geo
}

/** Window glazing + frame or entry door, placed inside an opening. */
function OpeningFixture({ o }: { o: Opening }) {
  const midY = o.sill + o.h / 2
  if (o.kind === 'door') {
    return (
      <group position={[o.x, 0, 0]}>
        <mesh castShadow receiveShadow position={[0, o.h / 2, 0]}>
          <boxGeometry args={[o.w - 0.06, o.h - 0.03, 0.07]} />
          <meshStandardMaterial color="#4d3a28" roughness={0.55} />
        </mesh>
        <mesh position={[o.w / 2 - 0.18, o.h / 2, 0.05]}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshStandardMaterial color="#c8b078" metalness={0.8} roughness={0.25} />
        </mesh>
      </group>
    )
  }
  return (
    <group position={[o.x, midY, 0]}>
      {/* frame */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[o.w + 0.06, o.h + 0.06, 0.1]} />
        <meshStandardMaterial color="#33363b" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* glass — env reflections make these read as real glazing */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[o.w - 0.08, o.h - 0.08, 0.12]} />
        <meshStandardMaterial
          color="#a8c8dc"
          transparent
          opacity={0.32}
          roughness={0.05}
          metalness={0.4}
          envMapIntensity={1.6}
        />
      </mesh>
      {/* mullion */}
      <mesh position={[0, 0, 0.062]}>
        <boxGeometry args={[0.03, o.h - 0.08, 0.012]} />
        <meshStandardMaterial color="#33363b" roughness={0.5} />
      </mesh>
    </group>
  )
}

interface WallProps {
  len: number
  height: number
  withDoor: boolean
  material: THREE.Material
  position: [number, number, number]
  rotationY: number
}

const ExteriorWall = memo(function ExteriorWall({ len, height, withDoor, material, position, rotationY }: WallProps) {
  const openings = computeOpenings(len, height, withDoor)
  const geometry = useDisposable(
    () => buildWallGeometry(len, height, WALL_THICKNESS, openings),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [len, height, withDoor],
  )
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh geometry={geometry} material={material} castShadow receiveShadow />
      {openings.map((o, i) => (
        <OpeningFixture key={i} o={o} />
      ))}
    </group>
  )
})

/** All four exterior walls for every floor. */
export function ExteriorWalls({ house, material }: { house: HouseSettings; material: THREE.Material }) {
  const { width, depth, floors, floorHeight } = house
  const t = WALL_THICKNESS
  const walls: JSX.Element[] = []

  for (let f = 0; f < floors; f++) {
    const y = f * floorHeight
    const key = (side: string) => `${side}-${f}`
    // Front (+z, holds the entry door on the ground floor) and back.
    walls.push(
      <ExteriorWall key={key('front')} len={width} height={floorHeight} withDoor={f === 0} material={material} position={[0, y, depth / 2 - t / 2]} rotationY={0} />,
      <ExteriorWall key={key('back')} len={width} height={floorHeight} withDoor={false} material={material} position={[0, y, -(depth / 2 - t / 2)]} rotationY={Math.PI} />,
      // Sides span between front/back walls to avoid double-thick corners.
      <ExteriorWall key={key('left')} len={depth - 2 * t} height={floorHeight} withDoor={false} material={material} position={[-(width / 2 - t / 2), y, 0]} rotationY={Math.PI / 2} />,
      <ExteriorWall key={key('right')} len={depth - 2 * t} height={floorHeight} withDoor={false} material={material} position={[width / 2 - t / 2, y, 0]} rotationY={-Math.PI / 2} />,
    )
  }
  return <>{walls}</>
}
