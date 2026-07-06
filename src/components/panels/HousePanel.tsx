import { RotateCcw } from 'lucide-react'
import { HOUSE_LIMITS } from '../../store/slices/houseSlice'
import { formatMeters } from '../../utils/format'
import { useStore } from '../../store'
import { Button } from '../ui/Button'
import { Section } from '../ui/Section'
import { SegmentedControl } from '../ui/SegmentedControl'
import { Slider } from '../ui/Slider'
import { Toggle } from '../ui/Toggle'
import type { RoofType } from '../../types'

/** Structure tab: parametric dimensions, roof, and scene helpers. */
export function HousePanel() {
  const house = useStore((s) => s.house)
  const setHouse = useStore((s) => s.setHouse)
  const showGrid = useStore((s) => s.showGrid)
  const toggleGrid = useStore((s) => s.toggleGrid)
  const snapEnabled = useStore((s) => s.snapEnabled)
  const toggleSnap = useStore((s) => s.toggleSnap)
  const resetProject = useStore((s) => s.resetProject)
  const showToast = useStore((s) => s.showToast)

  return (
    <div>
      <Section title="Dimensions">
        <Slider label="Width" value={house.width} {...HOUSE_LIMITS.width} format={formatMeters} onChange={(v) => setHouse({ width: v })} />
        <Slider label="Depth" value={house.depth} {...HOUSE_LIMITS.depth} format={formatMeters} onChange={(v) => setHouse({ depth: v })} />
        <Slider label="Floors" value={house.floors} {...HOUSE_LIMITS.floors} onChange={(v) => setHouse({ floors: v })} />
        <Slider label="Floor height" value={house.floorHeight} {...HOUSE_LIMITS.floorHeight} format={formatMeters} onChange={(v) => setHouse({ floorHeight: v })} />
        <Slider label="Rooms per floor" value={house.roomsPerFloor} {...HOUSE_LIMITS.roomsPerFloor} onChange={(v) => setHouse({ roomsPerFloor: v })} />
      </Section>

      <Section title="Roof">
        <SegmentedControl<RoofType>
          label="Roof type"
          value={house.roofType}
          onChange={(roofType) => setHouse({ roofType })}
          options={[
            { value: 'flat', label: 'Flat' },
            { value: 'gable', label: 'Gable' },
            { value: 'hip', label: 'Hip' },
          ]}
        />
        <Toggle
          label="Show roof"
          hint="Hide it to furnish rooms from above (shortcut: T)"
          checked={house.showRoof}
          onChange={(showRoof) => setHouse({ showRoof })}
        />
      </Section>

      <Section title="Workspace">
        <Toggle label="Ground grid" hint="1 m cells, 5 m sections (G)" checked={showGrid} onChange={toggleGrid} />
        <Toggle label="Snap to grid" hint="0.25 m placement grid — hold Alt to bypass" checked={snapEnabled} onChange={toggleSnap} />
        <Button
          variant="danger"
          size="sm"
          className="w-full"
          icon={<RotateCcw size={14} />}
          onClick={() => {
            resetProject()
            showToast('Project reset — press Ctrl+Z to undo')
          }}
        >
          Reset project
        </Button>
      </Section>
    </div>
  )
}
