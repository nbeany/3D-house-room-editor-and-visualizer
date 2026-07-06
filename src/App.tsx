import { lazy, Suspense, type DragEvent } from 'react'
import { FURNITURE_DND_TYPE } from './components/panels/FurniturePanel'
import { FirstPersonOverlay } from './components/layout/FirstPersonOverlay'
import { InspectorPanel } from './components/layout/InspectorPanel'
import { MiniMap } from './components/layout/MiniMap'
import { SceneLoader } from './components/layout/SceneLoader'
import { ShortcutsModal } from './components/layout/ShortcutsModal'
import { Sidebar } from './components/layout/Sidebar'
import { StatsBar } from './components/layout/StatsBar'
import { Toast } from './components/layout/Toast'
import { ToolHint } from './components/layout/ToolHint'
import { TopBar } from './components/layout/TopBar'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useTheme } from './hooks/useTheme'
import { useStore } from './store'
import type { FurnitureType } from './types'

// Code splitting: three.js + the whole scene load in parallel with (not
// blocking) the UI shell. Suspense shows a branded loader meanwhile.
const Scene = lazy(() => import('./components/three/Scene'))

export default function App() {
  useTheme()
  useKeyboardShortcuts()
  const setPendingDrop = useStore((s) => s.setPendingDrop)

  /** Catalog card dropped on the canvas → forward as NDC for raycast placement. */
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    const type = e.dataTransfer.getData(FURNITURE_DND_TYPE)
    if (!type) return
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const ndcY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    setPendingDrop({ type: type as FurnitureType, ndcX, ndcY })
  }

  return (
    <div className="relative h-dvh w-full select-none overflow-hidden bg-neutral-100 font-sans dark:bg-neutral-950">
      {/* 3D viewport (fills the screen; UI floats above) */}
      <div
        className="absolute inset-0"
        role="application"
        aria-label="3D house view. Drag to orbit, scroll to zoom. Select furniture to edit it; press ? for keyboard shortcuts."
        onDragOver={(e) => {
          if (e.dataTransfer.types.includes(FURNITURE_DND_TYPE)) {
            e.preventDefault()
            e.dataTransfer.dropEffect = 'copy'
          }
        }}
        onDrop={onDrop}
      >
        <Suspense fallback={<SceneLoader />}>
          <Scene />
        </Suspense>
      </div>

      {/* floating UI */}
      <TopBar />
      <Sidebar />
      <InspectorPanel />
      <StatsBar />
      <MiniMap />
      <ToolHint />
      <FirstPersonOverlay />
      <Toast />
      <ShortcutsModal />
    </div>
  )
}
