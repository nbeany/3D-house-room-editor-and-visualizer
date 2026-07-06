import { Banknote, DoorOpen, Palette, Ruler, Sofa } from 'lucide-react'
import type { ReactNode } from 'react'
import { getMaterial } from '../../constants/materials'
import { estimateCost, totalFloorArea } from '../../utils/cost'
import { formatArea, formatCompactCurrency } from '../../utils/format'
import { useStore } from '../../store'

function Stat({ icon, label, value, title }: { icon: ReactNode; label: string; value: string; title?: string }) {
  return (
    <div className="flex min-w-fit items-center gap-2.5 px-3 py-1" title={title}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent dark:bg-accent/20">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="whitespace-nowrap text-[13px] font-bold leading-tight tabular-nums text-neutral-900 dark:text-white">{value}</p>
        <p className="whitespace-nowrap text-[10px] font-medium uppercase tracking-wide leading-tight text-neutral-400">{label}</p>
      </div>
    </div>
  )
}

/**
 * Live project summary: area, rooms, cost, furniture count, wall material.
 * Floating pill on desktop; horizontally scrollable strip under the top bar
 * on small screens.
 */
export function StatsBar() {
  const house = useStore((s) => s.house)
  const materials = useStore((s) => s.materials)
  const furniture = useStore((s) => s.furniture)

  const area = totalFloorArea(house)
  const rooms = house.roomsPerFloor * house.floors
  const cost = estimateCost(house, materials, furniture)
  const wall = getMaterial('wall', materials.wall)

  const stats = (
    <>
      <Stat icon={<Ruler size={15} />} label="Total area" value={formatArea(area)} />
      <Stat icon={<DoorOpen size={15} />} label="Rooms" value={String(rooms)} />
      <Stat icon={<Banknote size={15} />} label="Est. cost" value={formatCompactCurrency(cost)} title="Structure + materials + furniture" />
      <Stat icon={<Sofa size={15} />} label="Furniture" value={String(furniture.length)} />
      <Stat icon={<Palette size={15} />} label="Material" value={wall.label} />
    </>
  )

  return (
    <>
      {/* desktop / tablet: floating pill */}
      <div
        className="glass pointer-events-auto absolute bottom-4 left-1/2 z-30 hidden -translate-x-1/2 items-center divide-x divide-black/[0.06] px-2 py-1.5 dark:divide-white/[0.08] md:flex"
        role="status"
        aria-label="Project summary"
      >
        {stats}
      </div>
      {/* mobile: scrollable strip below the top bar */}
      <div
        className="glass pointer-events-auto absolute inset-x-3 top-[68px] z-30 flex items-center overflow-x-auto px-1 py-1 md:hidden"
        role="status"
        aria-label="Project summary"
      >
        {stats}
      </div>
    </>
  )
}
