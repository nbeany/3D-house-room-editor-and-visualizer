import { Instance, Instances } from '@react-three/drei'
import { memo, useMemo } from 'react'
import { mulberry32 } from '../../utils/rng'
import { useStore } from '../../store'

/* ============================================================
 * Instanced vegetation — hundreds of meshes, a handful of draw
 * calls. Placement is seeded (deterministic) and re-flows around
 * the house whenever its footprint changes.
 * ============================================================ */

interface Placement {
  x: number
  z: number
  s: number
  r: number
}

function scatter(seed: number, count: number, minR: number, maxR: number, avoidW: number, avoidD: number): Placement[] {
  const rnd = mulberry32(seed)
  const out: Placement[] = []
  let guard = 0
  while (out.length < count && guard++ < count * 30) {
    const a = rnd() * Math.PI * 2
    const r = minR + rnd() * (maxR - minR)
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    // keep clear of the house footprint (+ a margin) and the entry path
    if (Math.abs(x) < avoidW / 2 + 1.6 && Math.abs(z) < avoidD / 2 + 1.6) continue
    if (Math.abs(x) < 1.6 && z > 0) continue
    out.push({ x, z, s: 0.75 + rnd() * 0.6, r: rnd() * Math.PI * 2 })
  }
  return out
}

const TREE_GREENS = ['#4e7a4a', '#5d8a52', '#446b42', '#6b9459']

export const Garden = memo(function Garden() {
  const width = useStore((s) => s.house.width)
  const depth = useStore((s) => s.house.depth)

  const trees = useMemo(() => scatter(101, 12, 11, 20, width, depth), [width, depth])
  const bushes = useMemo(() => scatter(202, 16, 7, 19, width, depth), [width, depth])
  const tufts = useMemo(() => scatter(303, 160, 3, 21, width, depth), [width, depth])

  return (
    <group>
      {/* trunks */}
      <Instances limit={trees.length} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.16, 1.6, 8]} />
        <meshStandardMaterial color="#6b4f37" roughness={0.9} />
        {trees.map((p, i) => (
          <Instance key={i} position={[p.x, 0.8 * p.s, p.z]} scale={p.s} rotation={[0, p.r, 0]} />
        ))}
      </Instances>
      {/* canopies (low-poly, flat shaded, per-instance color) */}
      <Instances limit={trees.length} castShadow>
        <icosahedronGeometry args={[1.05, 0]} />
        <meshStandardMaterial roughness={0.95} flatShading />
        {trees.map((p, i) => (
          <Instance
            key={i}
            position={[p.x, 1.6 * p.s + 0.7 * p.s, p.z]}
            scale={p.s}
            rotation={[0, p.r, p.r * 0.1]}
            color={TREE_GREENS[i % TREE_GREENS.length]}
          />
        ))}
      </Instances>
      {/* bushes */}
      <Instances limit={bushes.length} castShadow receiveShadow>
        <sphereGeometry args={[0.42, 10, 8]} />
        <meshStandardMaterial color="#54804d" roughness={1} flatShading />
        {bushes.map((p, i) => (
          <Instance key={i} position={[p.x, 0.28 * p.s, p.z]} scale={[p.s, p.s * 0.72, p.s]} rotation={[0, p.r, 0]} />
        ))}
      </Instances>
      {/* grass tufts */}
      <Instances limit={tufts.length}>
        <coneGeometry args={[0.05, 0.24, 5]} />
        <meshStandardMaterial color="#82a86f" roughness={1} />
        {tufts.map((p, i) => (
          <Instance key={i} position={[p.x, 0.1 * p.s, p.z]} scale={p.s} rotation={[0.08, p.r, -0.06]} />
        ))}
      </Instances>
    </group>
  )
})
