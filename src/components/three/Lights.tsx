import { memo } from 'react'

/** Sun direction shared with the Sky component (see Scene). */
export const SUN_POSITION: [number, number, number] = [26, 32, 14]

/**
 * Lighting rig: warm directional sun with a shadow frustum sized to
 * the plot, plus a cool hemisphere fill. Ambient depth comes from the
 * Lightformer environment map in Scene.tsx.
 */
export const Lights = memo(function Lights() {
  return (
    <>
      <hemisphereLight args={['#cfe5ff', '#8a9a7a', 0.45]} />
      <directionalLight
        position={SUN_POSITION}
        intensity={2.6}
        color="#fff2df"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={26}
        shadow-camera-bottom={-26}
        shadow-camera-near={5}
        shadow-camera-far={90}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
    </>
  )
})
