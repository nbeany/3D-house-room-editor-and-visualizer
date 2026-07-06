import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { FURNITURE_CATALOG, FURNITURE_CATEGORIES } from '../../constants/furniture'
import { formatCurrency } from '../../utils/format'
import { useStore } from '../../store'
import type { FurnitureCategory, FurnitureDef } from '../../types'

/** The MIME type used to hand catalog items to the canvas drop zone. */
export const FURNITURE_DND_TYPE = 'application/x-maison-furniture'

function CatalogCard({ def }: { def: FurnitureDef }) {
  const addFurniture = useStore((s) => s.addFurniture)
  const showToast = useStore((s) => s.showToast)
  const Icon = def.icon

  return (
    <button
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(FURNITURE_DND_TYPE, def.type)
        e.dataTransfer.effectAllowed = 'copy'
      }}
      onClick={() => {
        addFurniture(def.type)
        showToast(`${def.label} added — drag it into place`)
      }}
      aria-label={`Add ${def.label}, ${formatCurrency(def.price)}`}
      className="group flex cursor-grab flex-col items-start gap-2 rounded-2xl border border-black/[0.05] bg-white/60 p-3 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-soft active:scale-[0.97] active:cursor-grabbing dark:border-white/[0.07] dark:bg-white/[0.04] dark:hover:border-accent/50"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white dark:bg-accent/20">
        <Icon size={18} strokeWidth={1.8} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[12.5px] font-semibold text-neutral-800 dark:text-neutral-100">{def.label}</span>
        <span className="block text-[11px] tabular-nums text-neutral-400">{formatCurrency(def.price)}</span>
      </span>
    </button>
  )
}

/** Furniture tab: searchable, filterable catalog. Click to add, or drag onto the canvas. */
export function FurniturePanel() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<FurnitureCategory | 'all'>('all')

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    return FURNITURE_CATALOG.filter(
      (f) => (category === 'all' || f.category === category) && (!q || f.label.toLowerCase().includes(q)),
    )
  }, [query, category])

  return (
    <div>
      {/* search */}
      <div className="relative mb-3">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search furniture…"
          aria-label="Search furniture"
          className="h-9 w-full rounded-xl border border-black/[0.06] bg-black/[0.03] pl-9 pr-3 text-[13px] text-neutral-800 placeholder:text-neutral-400 focus:border-accent/50 focus:bg-white dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-neutral-100 dark:focus:bg-neutral-800"
        />
      </div>

      {/* category chips */}
      <div className="mb-4 flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
        {[{ id: 'all' as const, label: 'All' }, ...FURNITURE_CATEGORIES].map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            aria-pressed={category === c.id}
            className={
              'h-7 rounded-full px-3 text-[11.5px] font-semibold transition-colors ' +
              (category === c.id
                ? 'bg-accent text-white'
                : 'bg-black/[0.05] text-neutral-500 hover:bg-black/[0.09] dark:bg-white/[0.07] dark:text-neutral-400 dark:hover:bg-white/[0.12]')
            }
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {items.map((def) => (
          <CatalogCard key={def.type} def={def} />
        ))}
      </div>
      {items.length === 0 && (
        <p className="py-8 text-center text-[13px] text-neutral-400">No furniture matches “{query}”.</p>
      )}
      <p className="mt-4 text-center text-[11px] leading-relaxed text-neutral-400 dark:text-neutral-500">
        Tip: drag a card straight onto the canvas to place it exactly where you drop it.
      </p>
    </div>
  )
}
