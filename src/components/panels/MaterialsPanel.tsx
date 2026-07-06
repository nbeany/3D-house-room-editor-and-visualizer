import { MATERIALS_BY_CATEGORY } from '../../constants/materials'
import { formatCurrency } from '../../utils/format'
import { useStore } from '../../store'
import { Section } from '../ui/Section'
import { Swatch } from '../ui/Swatch'
import type { MaterialCategory } from '../../types'

const CATEGORY_LABELS: Record<MaterialCategory, string> = {
  wall: 'Exterior walls',
  floor: 'Interior floors',
  roof: 'Roof covering',
}

function MaterialGrid({ category }: { category: MaterialCategory }) {
  const selectedId = useStore((s) => s.materials[category])
  const setMaterial = useStore((s) => s.setMaterial)

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {MATERIALS_BY_CATEGORY[category].map((mat) => {
        const selected = mat.id === selectedId
        return (
          <div key={mat.id}>
            <Swatch size="lg" color={mat.color} label={mat.label} selected={selected} onSelect={() => setMaterial(category, mat.id)} />
            <div className="mt-1.5 flex items-baseline justify-between px-0.5">
              <span className={`truncate text-[12px] font-medium ${selected ? 'text-accent' : 'text-neutral-700 dark:text-neutral-300'}`}>
                {mat.label}
              </span>
              <span className="shrink-0 text-[10.5px] tabular-nums text-neutral-400">
                {formatCurrency(mat.costPerSqm)}/m²
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** Materials tab: wall / floor / roof finishes with live pricing. */
export function MaterialsPanel() {
  return (
    <div>
      {(Object.keys(CATEGORY_LABELS) as MaterialCategory[]).map((category) => (
        <Section key={category} title={CATEGORY_LABELS[category]}>
          <MaterialGrid category={category} />
        </Section>
      ))}
    </div>
  )
}
