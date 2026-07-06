import { ChevronDown, Map } from 'lucide-react'
import { useMemo } from 'react'
import { getFurnitureDef } from '../../constants/furniture'
import { computeRoomLayout, wallPiecesWithDoorway } from '../../utils/rooms'
import { useStore } from '../../store'
import { IconButton } from '../ui/IconButton'

/* ============================================================
 * Live 2D plan (SVG). World coordinates map 1:1 into the viewBox
 * (x → x, z → y), so the same room-layout function that builds
 * the 3D interior walls draws the plan — always in sync.
 * ============================================================ */

const VIEW = 23 // world half-extent shown, meters

export function MiniMap() {
  const open = useStore((s) => s.minimapOpen)
  const toggle = useStore((s) => s.toggleMinimap)
  const house = useStore((s) => s.house)
  const furniture = useStore((s) => s.furniture)
  const selectedId = useStore((s) => s.selectedId)
  const select = useStore((s) => s.select)
  const liveCam = useStore((s) => s.liveCam)
  const firstPerson = useStore((s) => s.cameraMode === 'firstPerson')

  const { width, depth, roomsPerFloor } = house
  const layout = useMemo(() => computeRoomLayout(width - 0.5, depth - 0.5, roomsPerFloor), [width, depth, roomsPerFloor])

  // Arrow rotation: svg "up" is (0,-1); heading is atan2(dx,dz) → π − heading.
  const camDeg = 180 - (liveCam.heading * 180) / Math.PI

  return (
    <div className="glass pointer-events-auto absolute bottom-4 right-4 z-30 hidden overflow-hidden md:block" aria-label="Plan view">
      <div className="flex items-center justify-between gap-6 py-1 pl-3 pr-1">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          <Map size={12} /> Plan
        </span>
        <IconButton label={open ? 'Collapse plan' : 'Expand plan'} tipSide="top" onClick={toggle} className="!h-7 !w-7">
          <ChevronDown size={14} className={`transition-transform duration-200 ${open ? '' : 'rotate-180'}`} />
        </IconButton>
      </div>

      {open && (
        <svg
          viewBox={`${-VIEW} ${-VIEW} ${VIEW * 2} ${VIEW * 2}`}
          className="block h-44 w-44"
          role="img"
          aria-label="Top-down plan of the house and furniture"
        >
          {/* lawn */}
          <circle cx={0} cy={0} r={VIEW - 1} className="fill-[#87a97a] dark:fill-[#4c6144]" />
          {/* house slab */}
          <rect x={-width / 2} y={-depth / 2} width={width} height={depth} rx={0.3} className="fill-[#f4f1e9] stroke-[#8b8778] dark:fill-[#3b3b40] dark:stroke-[#6a6a72]" strokeWidth={0.35} />
          {/* interior walls (same layout as 3D, doorway gaps included) */}
          {roomsPerFloor > 1 &&
            layout.walls.flatMap((seg, si) =>
              wallPiecesWithDoorway(seg).map(([from, to], pi) =>
                seg.axis === 'z' ? (
                  <line key={`${si}-${pi}`} x1={seg.at} y1={from} x2={seg.at} y2={to} className="stroke-[#8b8778] dark:stroke-[#6a6a72]" strokeWidth={0.28} />
                ) : (
                  <line key={`${si}-${pi}`} x1={from} y1={seg.at} x2={to} y2={seg.at} className="stroke-[#8b8778] dark:stroke-[#6a6a72]" strokeWidth={0.28} />
                ),
              ),
            )}
          {/* entry door notch (front = +z = bottom of the plan) */}
          <rect x={-0.6} y={depth / 2 - 0.3} width={1.2} height={0.6} rx={0.15} className="fill-[#c8b078]" />

          {/* furniture dots (clickable) */}
          {furniture.map((f) => {
            const def = getFurnitureDef(f.type)
            const r = Math.max(0.5, (Math.max(def.w, def.d) * f.scale) / 2)
            const isSelected = f.id === selectedId
            return (
              <circle
                key={f.id}
                cx={f.x}
                cy={f.z}
                r={r}
                onClick={() => select(f.id)}
                className={
                  'cursor-pointer transition-opacity hover:opacity-80 ' +
                  (isSelected ? 'fill-[#0a84ff]' : 'fill-[#7a8494] dark:fill-[#9aa2b0]')
                }
                opacity={isSelected ? 0.95 : 0.65}
              >
                <title>{def.label}</title>
              </circle>
            )
          })}

          {/* camera */}
          <g transform={`translate(${liveCam.x} ${liveCam.z}) rotate(${camDeg})`}>
            <polygon points="0,-1.5 1.05,1.2 0,0.55 -1.05,1.2" className="fill-[#0a84ff] stroke-white/70" strokeWidth={0.18} />
            {firstPerson && <circle r={0.55} className="fill-[#0a84ff]" />}
          </g>
        </svg>
      )}
    </div>
  )
}
