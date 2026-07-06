import { Copy, RotateCw, Trash2, X } from 'lucide-react'
import { FURNITURE_COLORS, getFurnitureDef } from '../../constants/furniture'
import { useBreakpoint } from '../../hooks/useMediaQuery'
import { formatCurrency } from '../../utils/format'
import { useStore } from '../../store'
import { Button } from '../ui/Button'
import { IconButton } from '../ui/IconButton'
import { Section } from '../ui/Section'
import { Slider } from '../ui/Slider'
import { Swatch } from '../ui/Swatch'

/* ============================================================
 * Selection inspector.
 * Desktop/tablet: floating card on the right with full editing.
 * Mobile: compact action bar (rotate / duplicate / delete).
 * ============================================================ */

export function InspectorPanel() {
  const breakpoint = useBreakpoint()
  const item = useStore((s) => s.furniture.find((f) => f.id === s.selectedId))
  const select = useStore((s) => s.select)
  const rotateFurniture = useStore((s) => s.rotateFurniture)
  const setFurnitureScale = useStore((s) => s.setFurnitureScale)
  const setFurnitureColor = useStore((s) => s.setFurnitureColor)
  const duplicateFurniture = useStore((s) => s.duplicateFurniture)
  const removeFurniture = useStore((s) => s.removeFurniture)

  if (!item) return null
  const def = getFurnitureDef(item.type)
  const Icon = def.icon

  if (breakpoint === 'mobile') {
    return (
      <div className="glass pointer-events-auto absolute bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 px-2 py-1.5 animate-fade-in" role="toolbar" aria-label={`${def.label} actions`}>
        <span className="px-2 text-[12px] font-semibold text-neutral-700 dark:text-neutral-200">{def.label}</span>
        <IconButton label="Rotate 15°" tipSide="top" onClick={() => rotateFurniture(item.id, 15)}>
          <RotateCw size={16} />
        </IconButton>
        <IconButton label="Duplicate" tipSide="top" onClick={() => duplicateFurniture(item.id)}>
          <Copy size={16} />
        </IconButton>
        <IconButton label="Delete" tipSide="top" onClick={() => removeFurniture(item.id)}>
          <Trash2 size={16} className="text-red-500" />
        </IconButton>
        <IconButton label="Deselect" tipSide="top" onClick={() => select(null)}>
          <X size={16} />
        </IconButton>
      </div>
    )
  }

  return (
    <aside className="glass pointer-events-auto absolute right-4 top-[76px] z-30 w-[276px] p-4 animate-fade-in" aria-label={`${def.label} inspector`}>
      {/* header */}
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent dark:bg-accent/20">
          <Icon size={19} strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-neutral-900 dark:text-white">{def.label}</p>
          <p className="text-[11.5px] tabular-nums text-neutral-400">{formatCurrency(def.price)}</p>
        </div>
        <IconButton label="Deselect (Esc)" onClick={() => select(null)}>
          <X size={16} />
        </IconButton>
      </div>

      <Section title="Transform">
        <Slider
          label="Rotation"
          value={item.rotY}
          min={0}
          max={345}
          step={15}
          format={(v) => `${v}°`}
          onChange={(v) => rotateFurniture(item.id, v - item.rotY)}
        />
        <Slider
          label="Scale"
          value={item.scale}
          min={0.7}
          max={1.4}
          step={0.05}
          format={(v) => `${Math.round(v * 100)}%`}
          onChange={(v) => setFurnitureScale(item.id, v)}
        />
        <p className="text-[11px] leading-relaxed text-neutral-400">
          Position <span className="tabular-nums">x {item.x.toFixed(2)} · z {item.z.toFixed(2)}</span> — drag in the scene or nudge with arrow keys.
        </p>
      </Section>

      <Section title="Finish">
        <div className="flex flex-wrap items-center gap-2">
          {FURNITURE_COLORS.map((c) => (
            <Swatch key={c} color={c} label={`Color ${c}`} selected={item.color === c} onSelect={() => setFurnitureColor(item.id, c)} />
          ))}
          <button
            onClick={() => setFurnitureColor(item.id, undefined)}
            className={
              'h-7 rounded-lg px-2 text-[11px] font-semibold transition-colors ' +
              (!item.color
                ? 'bg-accent/15 text-accent'
                : 'bg-black/[0.05] text-neutral-500 hover:bg-black/[0.1] dark:bg-white/[0.08] dark:text-neutral-400')
            }
          >
            Auto
          </button>
        </div>
      </Section>

      <div className="mt-4 flex gap-2">
        <Button size="sm" className="flex-1" icon={<Copy size={13} />} onClick={() => duplicateFurniture(item.id)}>
          Duplicate
        </Button>
        <Button size="sm" variant="danger" className="flex-1" icon={<Trash2 size={13} />} onClick={() => removeFurniture(item.id)}>
          Delete
        </Button>
      </div>
    </aside>
  )
}
