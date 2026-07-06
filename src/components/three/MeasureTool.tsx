import { Html, Line } from '@react-three/drei'
import { useEffect, useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { formatMeters } from '../../utils/format'
import { uid } from '../../utils/id'
import { useStore } from '../../store'

/* ============================================================
 * Measurement tool. While active, an invisible plane above the
 * ground captures clicks: first click anchors, second commits a
 * measurement. Existing measurements stay visible in any tool.
 * ============================================================ */

function DistanceLabel({ x, z, meters }: { x: number; z: number; meters: number }) {
  return (
    <Html position={[x, 0.35, z]} center zIndexRange={[30, 10]} style={{ pointerEvents: 'none' }}>
      <div className="measure-chip">{formatMeters(meters)}</div>
    </Html>
  )
}

export function MeasureTool() {
  const active = useStore((s) => s.tool === 'measure')
  const measurements = useStore((s) => s.measurements)
  const [pending, setPending] = useState<[number, number] | null>(null)
  const [hover, setHover] = useState<[number, number] | null>(null)

  // Leaving the tool abandons the in-progress point.
  useEffect(() => {
    if (!active) {
      setPending(null)
      setHover(null)
    }
  }, [active])

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const p: [number, number] = [e.point.x, e.point.z]
    if (!pending) {
      setPending(p)
    } else {
      useStore.getState().addMeasurement({ id: uid(), ax: pending[0], az: pending[1], bx: p[0], bz: p[1] })
      setPending(null)
    }
  }

  return (
    <group>
      {active && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.05, 0]}
          onClick={onClick}
          onPointerMove={(e) => {
            e.stopPropagation()
            setHover([e.point.x, e.point.z])
          }}
        >
          <planeGeometry args={[220, 220]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}

      {/* committed measurements */}
      {measurements.map((m) => {
        const dist = Math.hypot(m.bx - m.ax, m.bz - m.az)
        return (
          <group key={m.id}>
            <Line
              points={[
                [m.ax, 0.06, m.az],
                [m.bx, 0.06, m.bz],
              ]}
              color="#0a84ff"
              lineWidth={2}
            />
            {[[m.ax, m.az], [m.bx, m.bz]].map(([px, pz], i) => (
              <mesh key={i} position={[px, 0.06, pz]}>
                <sphereGeometry args={[0.055, 12, 12]} />
                <meshBasicMaterial color="#0a84ff" />
              </mesh>
            ))}
            <DistanceLabel x={(m.ax + m.bx) / 2} z={(m.az + m.bz) / 2} meters={dist} />
          </group>
        )
      })}

      {/* live preview from the anchored point to the cursor */}
      {active && pending && hover && (
        <group>
          <Line
            points={[
              [pending[0], 0.06, pending[1]],
              [hover[0], 0.06, hover[1]],
            ]}
            color="#0a84ff"
            lineWidth={1.5}
            dashed
            dashSize={0.18}
            gapSize={0.1}
          />
          <mesh position={[pending[0], 0.06, pending[1]]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshBasicMaterial color="#0a84ff" />
          </mesh>
          <DistanceLabel
            x={(pending[0] + hover[0]) / 2}
            z={(pending[1] + hover[1]) / 2}
            meters={Math.hypot(hover[0] - pending[0], hover[1] - pending[1])}
          />
        </group>
      )}
    </group>
  )
}
