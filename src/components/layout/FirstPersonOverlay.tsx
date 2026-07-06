import { Footprints, X } from 'lucide-react'
import { useStore } from '../../store'
import { Button } from '../ui/Button'
import { Kbd } from '../ui/Kbd'

/**
 * Walkthrough chrome. Pointer lock requires a user gesture, so an
 * invitation card is shown until the user clicks; while locked we
 * draw a crosshair + exit hint. The actual lock lives inside the
 * canvas (CameraRig) and is reached via a window event.
 */
export function FirstPersonOverlay() {
  const isFirstPerson = useStore((s) => s.cameraMode === 'firstPerson')
  const locked = useStore((s) => s.fpLocked)
  const setCameraMode = useStore((s) => s.setCameraMode)

  if (!isFirstPerson) return null

  if (locked) {
    return (
      <div className="pointer-events-none absolute inset-0 z-30" aria-hidden>
        {/* crosshair */}
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow-[0_0_6px_rgba(0,0,0,0.6)]" />
        <div className="glass absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-neutral-700 dark:text-neutral-200">
          <Kbd>W</Kbd>
          <Kbd>A</Kbd>
          <Kbd>S</Kbd>
          <Kbd>D</Kbd>
          <span className="text-neutral-400">walk</span>
          <Kbd>Shift</Kbd>
          <span className="text-neutral-400">run</span>
          <Kbd>Esc</Kbd>
          <span className="text-neutral-400">exit</span>
        </div>
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center p-4">
      <div className="glass pointer-events-auto max-w-sm p-6 text-center animate-fade-in" role="dialog" aria-label="Start walkthrough">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
          <Footprints size={22} />
        </span>
        <h2 className="text-[16px] font-semibold text-neutral-900 dark:text-white">First-person walkthrough</h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
          Walk through your house at eye level. Move with <strong>WASD</strong>, look with the mouse, hold{' '}
          <strong>Shift</strong> to run.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="primary" onClick={() => window.dispatchEvent(new CustomEvent('maison-fp-lock'))}>
            Start walking
          </Button>
          <Button icon={<X size={14} />} onClick={() => setCameraMode('orbit')}>
            Exit
          </Button>
        </div>
      </div>
    </div>
  )
}
