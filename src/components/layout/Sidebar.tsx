import { Home, Palette, Sofa, Sparkles, X } from 'lucide-react'
import { useBreakpoint } from '../../hooks/useMediaQuery'
import { useStore } from '../../store'
import { EffectsPanel } from '../panels/EffectsPanel'
import { FurniturePanel } from '../panels/FurniturePanel'
import { HousePanel } from '../panels/HousePanel'
import { MaterialsPanel } from '../panels/MaterialsPanel'
import { IconButton } from '../ui/IconButton'
import { Tabs, type TabDef } from '../ui/Tabs'
import type { SidebarTab } from '../../types'

const TABS: TabDef<SidebarTab>[] = [
  { id: 'build', label: 'Build', icon: <Home size={15} /> },
  { id: 'materials', label: 'Materials', icon: <Palette size={15} /> },
  { id: 'furniture', label: 'Furniture', icon: <Sofa size={15} /> },
  { id: 'effects', label: 'Effects', icon: <Sparkles size={15} /> },
]

const PANELS: Record<SidebarTab, () => JSX.Element> = {
  build: HousePanel,
  materials: MaterialsPanel,
  furniture: FurniturePanel,
  effects: EffectsPanel,
}

function PanelBody({ withClose }: { withClose?: boolean }) {
  const tab = useStore((s) => s.sidebarTab)
  const setTab = useStore((s) => s.setSidebarTab)
  const setMobilePanelOpen = useStore((s) => s.setMobilePanelOpen)
  const Panel = PANELS[tab]

  return (
    <>
      <div className="flex items-center gap-2 p-3 pb-2">
        <div className="flex-1">
          <Tabs tabs={TABS} active={tab} onChange={setTab} />
        </div>
        {withClose && (
          <IconButton label="Close panel" onClick={() => setMobilePanelOpen(false)}>
            <X size={17} />
          </IconButton>
        )}
      </div>
      <div
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-5 pt-2"
      >
        <Panel />
      </div>
    </>
  )
}

/**
 * The configuration panel across three layouts:
 *  desktop (≥1280px) — persistent floating panel on the left
 *  tablet — slide-in overlay toggled from the top bar
 *  mobile — bottom sheet toggled from the top bar
 */
export function Sidebar() {
  const breakpoint = useBreakpoint()
  const open = useStore((s) => s.mobilePanelOpen)
  const setOpen = useStore((s) => s.setMobilePanelOpen)

  if (breakpoint === 'desktop') {
    return (
      <aside className="glass pointer-events-auto absolute bottom-20 left-4 top-[76px] z-30 flex w-[344px] flex-col overflow-hidden" aria-label="Configuration panel">
        <PanelBody />
      </aside>
    )
  }

  if (!open) return null

  if (breakpoint === 'tablet') {
    return (
      <aside className="glass pointer-events-auto absolute bottom-4 left-3 top-[72px] z-40 flex w-[340px] flex-col overflow-hidden animate-fade-in" aria-label="Configuration panel">
        <PanelBody withClose />
      </aside>
    )
  }

  // mobile bottom sheet
  return (
    <div className="pointer-events-auto absolute inset-0 z-40" role="presentation" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
      <aside
        className="glass !rounded-b-none absolute inset-x-0 bottom-0 flex h-[62dvh] flex-col overflow-hidden animate-slide-up"
        aria-label="Configuration panel"
      >
        <div className="mx-auto mt-2 h-1 w-9 shrink-0 rounded-full bg-black/[0.15] dark:bg-white/[0.2]" aria-hidden />
        <PanelBody withClose />
      </aside>
    </div>
  )
}
