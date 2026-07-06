import { Home, Keyboard, Moon, PanelLeft, Redo2, Ruler, Sun, Undo2 } from 'lucide-react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useStore } from '../../store'
import { IconButton } from '../ui/IconButton'
import { SegmentedControl } from '../ui/SegmentedControl'
import { ExportMenu } from './ExportMenu'
import type { CameraMode } from '../../types'

/** Floating glass toolbar: brand, camera modes, tools, history, export, theme. */
export function TopBar() {
  const undo = useStore((s) => s.undo)
  const redo = useStore((s) => s.redo)
  const canUndo = useStore((s) => s.past.length > 0)
  const canRedo = useStore((s) => s.future.length > 0)
  const tool = useStore((s) => s.tool)
  const setTool = useStore((s) => s.setTool)
  const theme = useStore((s) => s.theme)
  const setTheme = useStore((s) => s.setTheme)
  const cameraMode = useStore((s) => s.cameraMode)
  const setCameraMode = useStore((s) => s.setCameraMode)
  const setActiveModal = useStore((s) => s.setActiveModal)
  const mobilePanelOpen = useStore((s) => s.mobilePanelOpen)
  const setMobilePanelOpen = useStore((s) => s.setMobilePanelOpen)
  const isTouch = useMediaQuery('(pointer: coarse)')

  const cameraOptions: { value: CameraMode; label: string }[] = [
    { value: 'orbit', label: 'Orbit' },
    { value: 'top', label: 'Top' },
    { value: 'front', label: 'Front' },
    // Pointer lock needs a real pointer — hide the walkthrough on touch devices.
    ...(!isTouch ? [{ value: 'firstPerson' as CameraMode, label: 'Walk' }] : []),
  ]

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-40 flex justify-center p-3">
      <div className="glass pointer-events-auto flex w-full max-w-6xl items-center gap-2 px-3 py-2">
        {/* sidebar toggle (overlay layouts only) */}
        <span className="xl:hidden">
          <IconButton label={mobilePanelOpen ? 'Close panel' : 'Open panel'} onClick={() => setMobilePanelOpen(!mobilePanelOpen)} active={mobilePanelOpen}>
            <PanelLeft size={17} />
          </IconButton>
        </span>

        {/* brand */}
        <div className="flex items-center gap-2.5 pr-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-white shadow-sm">
            <Home size={16} strokeWidth={2.2} />
          </span>
          <div className="hidden min-w-0 sm:block">
            <p className="text-[14px] font-bold leading-tight tracking-tight text-neutral-900 dark:text-white">Maison</p>
            <p className="text-[10px] leading-tight text-neutral-400">3D House Configurator</p>
          </div>
        </div>

        {/* camera modes */}
        <div className="mx-auto hidden w-full max-w-[340px] md:block">
          <SegmentedControl<CameraMode> label="Camera mode" options={cameraOptions} value={cameraMode} onChange={setCameraMode} />
        </div>
        <div className="mx-auto md:hidden" />

        {/* tools + history */}
        <div className="flex items-center gap-0.5">
          <IconButton label="Measure distances (M)" active={tool === 'measure'} onClick={() => setTool(tool === 'measure' ? 'select' : 'measure')}>
            <Ruler size={17} />
          </IconButton>
          <IconButton label="Undo (Ctrl+Z)" onClick={undo} disabled={!canUndo}>
            <Undo2 size={17} />
          </IconButton>
          <IconButton label="Redo (Ctrl+Shift+Z)" onClick={redo} disabled={!canRedo}>
            <Redo2 size={17} />
          </IconButton>
          <span className="hidden sm:block">
            <IconButton label="Keyboard shortcuts (?)" onClick={() => setActiveModal('shortcuts')}>
              <Keyboard size={17} />
            </IconButton>
          </span>
          <IconButton label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </IconButton>
        </div>

        <div className="mx-1 h-6 w-px bg-black/[0.08] dark:bg-white/[0.1]" aria-hidden />
        <ExportMenu />
      </div>
    </header>
  )
}
