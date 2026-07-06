import { useGLTF } from '@react-three/drei'
import type { GroupProps } from '@react-three/fiber'
import { useMemo } from 'react'

/* ============================================================
 * Production asset pipeline (ready to use, not used by the demo).
 *
 * The demo scene is 100% procedural so the app runs offline with
 * zero downloaded assets — but this component wires up everything
 * needed for real furniture/asset catalogs:
 *
 *  – GLTF/GLB loading with caching (drei useGLTF)
 *  – Draco mesh decompression: the second argument enables the
 *    Draco decoder automatically for .glb files with compressed
 *    geometry (decoder WASM is fetched on demand).
 *  – KTX2/Basis compressed textures: GLBs containing KTX2 textures
 *    can be enabled by passing a KTX2Loader through useGLTF's
 *    extendLoader callback — see the drei docs; the hook signature
 *    is already compatible.
 *
 * Usage:
 *   <Suspense fallback={null}>
 *     <GLTFModel url="/models/chair.glb" position={[1, 0, 2]} />
 *   </Suspense>
 * ============================================================ */

interface GLTFModelProps extends GroupProps {
  url: string
}

export function GLTFModel({ url, ...props }: GLTFModelProps) {
  const gltf = useGLTF(url, true) // true → Draco decoding enabled
  // Clone so multiple instances of the same cached asset can coexist.
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene])
  return (
    <group {...props}>
      <primitive object={scene} />
    </group>
  )
}

/** Warm the cache before the model is first shown. */
export const preloadGLTF = (url: string) => useGLTF.preload(url, true)
