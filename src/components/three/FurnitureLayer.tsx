import { useCursor } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { memo, useRef, useState } from 'react'
import type * as THREE from 'three'
import { getFurnitureDef } from '../../constants/furniture'
import { rayToGround, snap } from '../../utils/three/raycast'
import { useStore } from '../../store'
import type { FurnitureItem } from '../../types'
import { FurnitureModel } from './models'

const SNAP_STEP = 0.25

/* ============================================================
 * Interactive furniture. Dragging uses pointer capture + manual
 * ray→ground-plane intersection so items track the cursor exactly
 * even when the pointer leaves the mesh. History is captured once
 * at drag start (beginDrag), so a whole drag is one undo step.
 * ============================================================ */

const PlacedFurniture = memo(function PlacedFurniture({ item }: { item: FurnitureItem }) {
  const [hovered, setHovered] = useState(false)
  const grab = useRef<{ dx: number; dz: number } | null>(null)
  const selected = useStore((s) => s.selectedId === item.id)
  useCursor(hovered, 'grab')

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    const s = useStore.getState()
    if (s.tool !== 'select' || s.cameraMode === 'firstPerson') return
    e.stopPropagation()
    if (e.button !== 0) return
    const hit = rayToGround(e.ray)
    if (!hit) return
    grab.current = { dx: item.x - hit[0], dz: item.z - hit[1] }
    s.beginDrag(item.id)
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    const s = useStore.getState()
    if (s.draggingId !== item.id || !grab.current) return
    e.stopPropagation()
    const hit = rayToGround(e.ray)
    if (!hit) return
    const step = s.snapEnabled && !e.altKey ? SNAP_STEP : 0
    s.moveFurniture(item.id, snap(hit[0] + grab.current.dx, step), snap(hit[1] + grab.current.dz, step))
  }

  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    const s = useStore.getState()
    if (s.draggingId === item.id) {
      e.stopPropagation()
      s.endDrag()
      grab.current = null
      ;(e.target as Element).releasePointerCapture(e.pointerId)
    }
  }

  return (
    <group
      position={[item.x, 0, item.z]}
      rotation={[0, (item.rotY * Math.PI) / 180, 0]}
      scale={item.scale}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerOver={(e) => {
        e.stopPropagation()
        if (useStore.getState().tool === 'select') setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <FurnitureModel item={item} />
      {/* soft hover glow disc (cheaper + calmer than an outline pass) */}
      {hovered && !selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
          <circleGeometry args={[Math.max(getFurnitureDef(item.type).w, getFurnitureDef(item.type).d) * 0.62, 32]} />
          <meshBasicMaterial color="#0a84ff" transparent opacity={0.1} depthWrite={false} />
        </mesh>
      )}
    </group>
  )
})

/** Pulsing ring that follows the selected item. */
function SelectionRing() {
  const ringRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  const selectedId = useStore((s) => s.selectedId)
  const item = useStore((s) => s.furniture.find((f) => f.id === s.selectedId))

  useFrame(({ clock }) => {
    if (!ringRef.current || !matRef.current || !item) return
    ringRef.current.position.set(item.x, 0.02, item.z)
    const t = clock.getElapsedTime()
    matRef.current.opacity = 0.55 + Math.sin(t * 3.5) * 0.2
  })

  if (!selectedId || !item) return null
  const def = getFurnitureDef(item.type)
  const radius = (Math.max(def.w, def.d) * item.scale) / 2 + 0.28

  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.045, radius, 48]} />
      <meshBasicMaterial ref={matRef} color="#0a84ff" transparent opacity={0.6} depthWrite={false} />
    </mesh>
  )
}

export function FurnitureLayer() {
  const furniture = useStore((s) => s.furniture)
  return (
    <group>
      {furniture.map((item) => (
        <PlacedFurniture key={item.id} item={item} />
      ))}
      <SelectionRing />
    </group>
  )
}
