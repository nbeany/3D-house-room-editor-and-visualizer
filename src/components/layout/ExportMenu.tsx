import { Box, Camera, ChevronDown, FileJson, Share, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { getFurnitureDef } from '../../constants/furniture'
import { MATERIALS_BY_CATEGORY } from '../../constants/materials'
import { sanitizeHouse } from '../../store/slices/houseSlice'
import { exportGLTF, exportJSON, exportPNG, parseProjectFile } from '../../utils/export'
import { useStore } from '../../store'
import type { FurnitureItem, MaterialSelection } from '../../types'

/* ============================================================
 * Export dropdown: PNG screenshot, JSON save/load, GLTF scene.
 * Imports are validated + sanitized and are fully undoable.
 * ============================================================ */

function sanitizeImportedFurniture(items: FurnitureItem[]): FurnitureItem[] {
  return items.filter((f) => {
    try {
      getFurnitureDef(f.type)
      return Number.isFinite(f.x) && Number.isFinite(f.z) && typeof f.id === 'string'
    } catch {
      return false
    }
  })
}

function sanitizeImportedMaterials(m: MaterialSelection): MaterialSelection {
  const pick = (cat: keyof MaterialSelection) =>
    MATERIALS_BY_CATEGORY[cat].some((d) => d.id === m[cat]) ? m[cat] : MATERIALS_BY_CATEGORY[cat][0].id
  return { wall: pick('wall'), floor: pick('floor'), roof: pick('roof') }
}

export function ExportMenu() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const showToast = useStore((s) => s.showToast)

  // Close on outside click.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const run = (fn: () => boolean | void, okMessage: string) => {
    setOpen(false)
    const result = fn()
    showToast(result === false ? 'Export failed — scene not ready' : okMessage)
  }

  const onImportFile = async (file: File) => {
    try {
      const project = parseProjectFile(await file.text())
      const s = useStore.getState()
      s.pushHistory()
      useStore.setState({
        house: sanitizeHouse(project.house),
        materials: sanitizeImportedMaterials(project.materials),
        furniture: sanitizeImportedFurniture(project.furniture),
        selectedId: null,
      })
      showToast('Project imported')
    } catch {
      showToast('Import failed — not a valid Maison file')
    }
  }

  const itemClass =
    'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-neutral-700 transition-colors hover:bg-black/[0.05] dark:text-neutral-200 dark:hover:bg-white/[0.08]'

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-accent px-3.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-accent-strong active:scale-[0.97]"
      >
        <Share size={15} />
        <span className="hidden sm:inline">Export</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div role="menu" aria-label="Export options" className="glass absolute right-0 top-11 z-50 w-60 p-1.5 animate-fade-in">
          <button role="menuitem" className={itemClass} onClick={() => run(exportPNG, 'Screenshot saved')}>
            <Camera size={16} className="text-accent" /> PNG screenshot
          </button>
          <button
            role="menuitem"
            className={itemClass}
            onClick={() =>
              run(() => {
                const s = useStore.getState()
                exportJSON({ house: s.house, materials: s.materials, furniture: s.furniture })
              }, 'Configuration saved')
            }
          >
            <FileJson size={16} className="text-accent" /> JSON configuration
          </button>
          <button role="menuitem" className={itemClass} onClick={() => run(exportGLTF, 'GLB scene exported')}>
            <Box size={16} className="text-accent" /> GLTF 3D scene (.glb)
          </button>
          <div className="mx-2 my-1.5 h-px bg-black/[0.06] dark:bg-white/[0.08]" />
          <button role="menuitem" className={itemClass} onClick={() => fileRef.current?.click()}>
            <Upload size={16} className="text-neutral-400" /> Import JSON…
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void onImportFile(file)
              e.target.value = ''
              setOpen(false)
            }}
          />
        </div>
      )}
    </div>
  )
}
