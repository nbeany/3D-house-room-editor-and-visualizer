import { useStore } from '../../store'
import { Section } from '../ui/Section'
import { Toggle } from '../ui/Toggle'

/** Effects tab: post-processing, reflections, camera motion and accessibility. */
export function EffectsPanel() {
  const effects = useStore((s) => s.effects)
  const setEffect = useStore((s) => s.setEffect)
  const autoRotate = useStore((s) => s.autoRotate)
  const setAutoRotate = useStore((s) => s.setAutoRotate)
  const cameraMode = useStore((s) => s.cameraMode)
  const highContrast = useStore((s) => s.highContrast)
  const setHighContrast = useStore((s) => s.setHighContrast)

  return (
    <div>
      <Section title="Rendering">
        <Toggle label="Ambient occlusion" hint="SSAO — grounds furniture with contact shading" checked={effects.ssao} onChange={(v) => setEffect('ssao', v)} />
        <Toggle label="Bloom" hint="Soft glow on lamps and screens" checked={effects.bloom} onChange={(v) => setEffect('bloom', v)} />
        <Toggle label="Floor reflections" hint="Real-time planar reflections indoors (GPU-heavy)" checked={effects.reflections} onChange={(v) => setEffect('reflections', v)} />
        <Toggle label="Depth of field" hint="Cinematic focus falloff" checked={effects.depthOfField} onChange={(v) => setEffect('depthOfField', v)} />
        <Toggle label="Vignette" hint="Subtle darkened corners" checked={effects.vignette} onChange={(v) => setEffect('vignette', v)} />
      </Section>

      <Section title="Camera">
        <Toggle
          label="Auto-rotate"
          hint="Slow cinematic orbit while idle"
          checked={autoRotate}
          onChange={setAutoRotate}
          disabled={cameraMode !== 'orbit'}
        />
      </Section>

      <Section title="Accessibility">
        <Toggle
          label="High contrast UI"
          hint="Stronger borders and text, no translucency"
          checked={highContrast}
          onChange={setHighContrast}
        />
      </Section>
    </div>
  )
}
