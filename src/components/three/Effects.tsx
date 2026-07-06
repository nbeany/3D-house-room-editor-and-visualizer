import { Bloom, DepthOfField, EffectComposer, SSAO, Vignette } from '@react-three/postprocessing'
import { Component, type ReactNode } from 'react'
import { useStore } from '../../store'

/* ============================================================
 * Post-processing pipeline: SSAO grounds objects, subtle bloom
 * lifts emissive highlights (lamps, screens), optional depth of
 * field and a soft vignette. Each pass is user-toggleable and the
 * whole composer unmounts when everything is off — zero cost.
 * ============================================================ */

/** If a pass fails on exotic GPUs/drivers, degrade gracefully instead of white-screening. */
class EffectsBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    const s = useStore.getState()
    s.setEffect('ssao', false)
    s.setEffect('bloom', false)
    s.setEffect('depthOfField', false)
    s.setEffect('vignette', false)
    s.showToast('Post-processing disabled — GPU compatibility')
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

function Passes() {
  const effects = useStore((s) => s.effects)
  const { bloom, ssao, depthOfField, vignette } = effects

  if (!bloom && !ssao && !depthOfField && !vignette) return null

  const passes: JSX.Element[] = []
  if (ssao) {
    passes.push(
      <SSAO
        key="ssao"
        samples={24}
        rings={4}
        radius={0.14}
        intensity={22}
        luminanceInfluence={0.6}
        // world* parameters are required by the distance-scaled SSAO variant —
        // omitting them yields NaNs (black screen) on some drivers.
        worldDistanceThreshold={28}
        worldDistanceFalloff={4}
        worldProximityThreshold={0.4}
        worldProximityFalloff={0.2}
      />,
    )
  }
  if (bloom) {
    passes.push(<Bloom key="bloom" mipmapBlur intensity={0.55} luminanceThreshold={1.05} luminanceSmoothing={0.2} />)
  }
  if (depthOfField) {
    passes.push(<DepthOfField key="dof" focusDistance={0.012} focalLength={0.08} bokehScale={2.6} height={520} />)
  }
  if (vignette) {
    passes.push(<Vignette key="vignette" eskil={false} offset={0.28} darkness={0.42} />)
  }

  return (
    <EffectComposer multisampling={4} enableNormalPass={ssao}>
      {passes}
    </EffectComposer>
  )
}

export function Effects() {
  return (
    <EffectsBoundary>
      <Passes />
    </EffectsBoundary>
  )
}
