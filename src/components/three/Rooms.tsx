import { memo, useMemo } from 'react'
import { computeRoomLayout, wallPiecesWithDoorway } from '../../utils/rooms'
import { WALL_THICKNESS } from './Walls'
import type { HouseSettings } from '../../types'

const INTERIOR_THICKNESS = 0.12

/**
 * Interior partition walls, generated from the deterministic room layout.
 * Every wall gets a centered doorway gap so rooms remain walkable in
 * first-person mode. The same layout feeds the minimap.
 */
export const InteriorWalls = memo(function InteriorWalls({ house }: { house: HouseSettings }) {
  const { width, depth, floors, floorHeight, roomsPerFloor } = house

  const layout = useMemo(
    () => computeRoomLayout(width - WALL_THICKNESS * 2, depth - WALL_THICKNESS * 2, roomsPerFloor),
    [width, depth, roomsPerFloor],
  )

  if (roomsPerFloor <= 1) return null

  const walls: JSX.Element[] = []
  for (let f = 0; f < floors; f++) {
    const y = f * floorHeight
    layout.walls.forEach((seg, si) => {
      wallPiecesWithDoorway(seg).forEach(([from, to], pi) => {
        const len = to - from
        if (len <= 0.05) return
        const mid = (from + to) / 2
        const key = `${f}-${si}-${pi}`
        if (seg.axis === 'z') {
          // Wall runs along Z at x = seg.at
          walls.push(
            <mesh key={key} castShadow receiveShadow position={[seg.at, y + floorHeight / 2, mid]}>
              <boxGeometry args={[INTERIOR_THICKNESS, floorHeight, len]} />
              <meshStandardMaterial color="#eceae4" roughness={0.95} />
            </mesh>,
          )
        } else {
          // Wall runs along X at z = seg.at
          walls.push(
            <mesh key={key} castShadow receiveShadow position={[mid, y + floorHeight / 2, seg.at]}>
              <boxGeometry args={[len, floorHeight, INTERIOR_THICKNESS]} />
              <meshStandardMaterial color="#eceae4" roughness={0.95} />
            </mesh>,
          )
        }
      })
    })
  }
  return <>{walls}</>
})
