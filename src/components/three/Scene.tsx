import { Environment, Html, Lightformer, PerformanceMonitor, Preload, Sky } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import type * as THREE from 'three'
import { sceneRefs } from '../../utils/three/sceneRefs'
import { useStore } from '../../store'
import { CameraRig } from './CameraRig'
import { Effects } from './Effects'
import { FurnitureLayer } from './FurnitureLayer'
import { Garden } from './Garden'
import { Ground } from './Ground'
import { House } from './House'
import { Lights, SUN_POSITION } from './Lights'
import { MeasureTool } from './MeasureTool'
import { SceneBridge } from './SceneBridge'

/* ============================================================
 * The 3D scene root. This module is code-split (React.lazy in
 * App.tsx) so the UI shell paints before three.js is even
 * downloaded. Everything inside <Canvas> renders exclusively
 * from narrow store selectors — UI state changes never touch it.
 * ============================================================ */

function SceneContent() {
  // Only this group is serialized by the GLTF exporter (no terrain/helpers).
  const exportRef = useRef<THREE.Group>(null)
  useEffect(() => {
    sceneRefs.exportGroup = exportRef.current
    return () => {
      sceneRefs.exportGroup = null
    }
  }, [])

  return (
    <>
      {/* Physical sky + lightformer environment: rich IBL without fetching a single HDRI */}
      <Sky sunPosition={SUN_POSITION} turbidity={5.5} rayleigh={0.65} mieCoefficient={0.004} mieDirectionalG={0.85} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={1.1} position={[0, 12, 0]} rotation-x={Math.PI / 2} scale={[24, 24, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={0.5} position={[-14, 5, -6]} rotation-y={Math.PI / 2} scale={[12, 6, 1]} color="#bcd6ff" />
        <Lightformer form="rect" intensity={0.45} position={[12, 4, 8]} rotation-y={-Math.PI / 2} scale={[10, 5, 1]} color="#ffe6c7" />
      </Environment>
      <Lights />

      <group ref={exportRef}>
        <House />
        <FurnitureLayer />
        <Garden />
      </group>

      <Ground />
      <MeasureTool />
      <CameraRig />
      <SceneBridge />
      <Effects />
      <Preload all />
    </>
  )
}

export default function Scene() {
  // PerformanceMonitor steers resolution between 1× and native DPR under load.
  const [dpr, setDpr] = useState(1.5)

  return (
    <Canvas
      shadows
      dpr={dpr}
      camera={{ position: [14, 9, 16], fov: 42, near: 0.1, far: 260 }}
      // preserveDrawingBuffer keeps the backbuffer readable for PNG export.
      gl={{ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => useStore.getState().select(null)}
    >
      <PerformanceMonitor
        onIncline={() => setDpr(Math.min(2, window.devicePixelRatio || 2))}
        onDecline={() => setDpr(1)}
      >
        <Suspense
          fallback={
            <Html center>
              <div className="scene-spinner" role="status" aria-label="Preparing 3D scene" />
            </Html>
          }
        >
          <SceneContent />
        </Suspense>
      </PerformanceMonitor>
    </Canvas>
  )
}
