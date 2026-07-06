import { CameraControls, PointerLockControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, type ElementRef } from 'react'
import * as THREE from 'three'
import { useStore } from '../../store'
import type { CameraMode } from '../../types'

const dirScratch = new THREE.Vector3()
const rightScratch = new THREE.Vector3()

type CameraControlsRef = ElementRef<typeof CameraControls>
type PointerLockRef = ElementRef<typeof PointerLockControls>

/** Framing presets: [camX, camY, camZ, targetX, targetY, targetZ]. */
const PRESETS: Record<Exclude<CameraMode, 'firstPerson'>, [number, number, number, number, number, number]> = {
  orbit: [14, 9, 16, 0, 1.4, 0],
  top: [0.02, 34, 0.02, 0, 0, 0],
  front: [0, 3.6, 24, 0, 2, 0],
}

const EYE_HEIGHT = 1.65
const WALK_BOUND = 20

/** Orbit / top / front modes via smooth CameraControls transitions. */
function OrbitRig({ mode }: { mode: Exclude<CameraMode, 'firstPerson'> }) {
  const ref = useRef<CameraControlsRef>(null)
  const dragging = useStore((s) => s.draggingId !== null)
  const autoRotate = useStore((s) => s.autoRotate)

  // Fly to the preset whenever the mode changes.
  useEffect(() => {
    ref.current?.setLookAt(...PRESETS[mode], true)
  }, [mode])

  // Camera control must yield while a furniture drag is in progress.
  useEffect(() => {
    if (ref.current) ref.current.enabled = !dragging
  }, [dragging])

  useFrame((_, delta) => {
    if (autoRotate && mode === 'orbit' && ref.current && !dragging) {
      ref.current.azimuthAngle += delta * 0.12
    }
  })

  return (
    <CameraControls
      ref={ref}
      makeDefault
      minDistance={3}
      maxDistance={70}
      maxPolarAngle={Math.PI / 2 - 0.03}
      dollyToCursor
    />
  )
}

/** WASD + pointer-lock walkthrough at eye height. */
function FirstPersonRig() {
  const controlsRef = useRef<PointerLockRef>(null)
  const keys = useRef(new Set<string>())
  const { camera } = useThree()
  const depth = useStore((s) => s.house.depth)

  // Enter in front of the door, facing the house.
  useEffect(() => {
    camera.position.set(0, EYE_HEIGHT, depth / 2 + 4.5)
    camera.lookAt(0, EYE_HEIGHT - 0.1, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => keys.current.add(e.key.toLowerCase())
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase())
    // The overlay button can't reach into the canvas — it raises this event.
    const lock = () => controlsRef.current?.lock()
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('maison-fp-lock', lock)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('maison-fp-lock', lock)
      keys.current.clear()
    }
  }, [])

  useFrame((state, delta) => {
    if (!useStore.getState().fpLocked) return
    const k = keys.current
    const forward = (k.has('w') ? 1 : 0) - (k.has('s') ? 1 : 0)
    const strafe = (k.has('d') ? 1 : 0) - (k.has('a') ? 1 : 0)
    if (!forward && !strafe) return

    const speed = (k.has('shift') ? 6.5 : 3.6) * delta
    const cam = state.camera
    const dir = cam.getWorldDirection(dirScratch)
    dir.y = 0
    dir.normalize()
    // right = forward × up (Y-up)
    rightScratch.set(-dir.z, 0, dir.x)

    cam.position.addScaledVector(dir, forward * speed)
    cam.position.addScaledVector(rightScratch, strafe * speed)
    cam.position.x = Math.min(WALK_BOUND, Math.max(-WALK_BOUND, cam.position.x))
    cam.position.z = Math.min(WALK_BOUND, Math.max(-WALK_BOUND, cam.position.z))
    cam.position.y = EYE_HEIGHT
  })

  return (
    <PointerLockControls
      ref={controlsRef}
      makeDefault
      onLock={() => useStore.getState().setFpLocked(true)}
      onUnlock={() => {
        const s = useStore.getState()
        s.setFpLocked(false)
        // Unlocking (Esc) exits the walkthrough entirely — predictable round-trip.
        if (s.cameraMode === 'firstPerson') s.setCameraMode('orbit')
      }}
    />
  )
}

export function CameraRig() {
  const mode = useStore((s) => s.cameraMode)
  return mode === 'firstPerson' ? <FirstPersonRig /> : <OrbitRig mode={mode} />
}
