import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { getFurnitureDef } from '../../constants/furniture'
import { ndcToGround, snap } from '../../utils/three/raycast'
import { sceneRefs } from '../../utils/three/sceneRefs'
import { useStore } from '../../store'

const dirScratch = new THREE.Vector3()

/**
 * Invisible glue component living inside the Canvas:
 *  – publishes gl/scene/camera into sceneRefs for the export utilities,
 *  – mirrors the camera into the store at ~8 Hz for the minimap,
 *  – resolves catalog drops (DOM drag-and-drop) into world positions.
 */
export function SceneBridge() {
  const { gl, scene, camera } = useThree()
  const throttle = useRef(0)
  const pendingDrop = useStore((s) => s.pendingDrop)

  useEffect(() => {
    sceneRefs.gl = gl
    sceneRefs.scene = scene
    return () => {
      sceneRefs.gl = null
      sceneRefs.scene = null
    }
  }, [gl, scene])

  useEffect(() => {
    sceneRefs.camera = camera
  }, [camera])

  // Minimap camera tracking — cheap store write, throttled.
  useFrame((state, delta) => {
    throttle.current += delta
    if (throttle.current < 0.12) return
    throttle.current = 0
    const cam = state.camera
    cam.getWorldDirection(dirScratch)
    const heading = Math.atan2(dirScratch.x, dirScratch.z)
    const live = useStore.getState().liveCam
    if (
      Math.abs(live.x - cam.position.x) > 0.05 ||
      Math.abs(live.z - cam.position.z) > 0.05 ||
      Math.abs(live.heading - heading) > 0.01
    ) {
      useStore.getState().setLiveCam(cam.position.x, cam.position.z, heading)
    }
  })

  // Materialize catalog drops: NDC → ground-plane position → addFurniture.
  useEffect(() => {
    if (!pendingDrop) return
    const s = useStore.getState()
    const hit = ndcToGround(pendingDrop.ndcX, pendingDrop.ndcY, camera)
    if (hit) {
      const step = s.snapEnabled ? 0.25 : 0
      s.addFurniture(pendingDrop.type, snap(hit[0], step), snap(hit[1], step))
      s.showToast(`${getFurnitureDef(pendingDrop.type).label} placed`)
    }
    s.setPendingDrop(null)
  }, [pendingDrop, camera])

  return null
}
