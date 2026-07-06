import { Eraser } from 'lucide-react'
import { useStore } from '../../store'
import { Kbd } from '../ui/Kbd'

/**
 * Context-sensitive helper chip (bottom-left, desktop only):
 * tells the user what the current tool/selection responds to.
 */
export function ToolHint() {
  const tool = useStore((s) => s.tool)
  const dragging = useStore((s) => s.draggingId !== null)
  const hasSelection = useStore((s) => s.selectedId !== null)
  const hasMeasurements = useStore((s) => s.measurements.length > 0)
  const clearMeasurements = useStore((s) => s.clearMeasurements)
  const firstPerson = useStore((s) => s.cameraMode === 'firstPerson')
  const snapEnabled = useStore((s) => s.snapEnabled)

  if (firstPerson) return null

  let content: JSX.Element
  if (tool === 'measure') {
    content = (
      <>
        <span>Click two points to measure</span>
        <Kbd>Esc</Kbd>
        <span className="text-neutral-400">exit</span>
        {hasMeasurements && (
          <button
            onClick={clearMeasurements}
            className="ml-1 inline-flex items-center gap-1 rounded-lg bg-black/[0.06] px-2 py-1 text-[11px] font-semibold text-neutral-600 hover:bg-black/[0.12] dark:bg-white/[0.1] dark:text-neutral-300"
          >
            <Eraser size={11} /> Clear
          </button>
        )}
      </>
    )
  } else if (dragging) {
    content = (
      <>
        <span>{snapEnabled ? 'Snapping to 0.25 m grid' : 'Free placement'}</span>
        {snapEnabled && (
          <>
            <Kbd>Alt</Kbd>
            <span className="text-neutral-400">free move</span>
          </>
        )}
      </>
    )
  } else if (hasSelection) {
    content = (
      <>
        <Kbd>R</Kbd>
        <span className="text-neutral-400">rotate</span>
        <Kbd>D</Kbd>
        <span className="text-neutral-400">duplicate</span>
        <Kbd>Del</Kbd>
        <span className="text-neutral-400">remove</span>
        <Kbd>↑↓←→</Kbd>
        <span className="text-neutral-400">nudge</span>
      </>
    )
  } else {
    content = (
      <>
        <span>Drag furniture from the library · scroll to zoom</span>
        <Kbd>?</Kbd>
        <span className="text-neutral-400">shortcuts</span>
      </>
    )
  }

  return (
    <div className="glass pointer-events-auto absolute bottom-4 left-4 z-30 hidden items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-neutral-700 dark:text-neutral-200 xl:flex">
      {content}
    </div>
  )
}
