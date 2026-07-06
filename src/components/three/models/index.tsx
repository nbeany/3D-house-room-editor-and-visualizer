import { RoundedBox } from '@react-three/drei'
import { memo, type ReactNode } from 'react'
import type { FurnitureItem, FurnitureType } from '../../../types'
import { getFurnitureDef } from '../../../constants/furniture'
import { mulberry32 } from '../../../utils/rng'

/* ============================================================
 * Procedural furniture models.
 * Every model is built from primitives, sits with its base at
 * y = 0 (snap-to-floor is therefore guaranteed by construction)
 * and faces +Z at rotY = 0. `color` is the user-configurable
 * accent applied to the primary surface of each piece.
 * ============================================================ */

const WOOD_DARK = '#5b4a38'
const METAL = '#3a3a3e'
const LEG = '#2e2a26'

/** Shorthand for a shadowed mesh — keeps the models readable. */
function M({ position, rotation, children }: { position?: [number, number, number]; rotation?: [number, number, number]; children: ReactNode }) {
  return (
    <mesh castShadow receiveShadow position={position} rotation={rotation}>
      {children}
    </mesh>
  )
}

function Legs({ w, d, h, r = 0.03, inset = 0.08 }: { w: number; d: number; h: number; r?: number; inset?: number }) {
  const x = w / 2 - inset
  const z = d / 2 - inset
  return (
    <>
      {[[-x, -z], [x, -z], [-x, z], [x, z]].map(([lx, lz], i) => (
        <mesh key={i} castShadow position={[lx, h / 2, lz]}>
          <cylinderGeometry args={[r, r * 0.8, h, 10]} />
          <meshStandardMaterial color={LEG} roughness={0.6} />
        </mesh>
      ))}
    </>
  )
}

/* ------------------------------- Seating ------------------------------- */

function Sofa({ color }: { color: string }) {
  return (
    <group>
      <Legs w={2.0} d={0.9} h={0.12} />
      {/* base */}
      <RoundedBox args={[2.1, 0.32, 0.95]} radius={0.06} position={[0, 0.28, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.9} />
      </RoundedBox>
      {/* backrest along -z */}
      <RoundedBox args={[2.1, 0.45, 0.22]} radius={0.07} position={[0, 0.62, -0.36]} castShadow>
        <meshStandardMaterial color={color} roughness={0.9} />
      </RoundedBox>
      {/* arms */}
      {[-0.97, 0.97].map((x) => (
        <RoundedBox key={x} args={[0.18, 0.34, 0.9]} radius={0.06} position={[x, 0.58, 0]} castShadow>
          <meshStandardMaterial color={color} roughness={0.9} />
        </RoundedBox>
      ))}
      {/* seat cushions */}
      {[-0.5, 0.5].map((x) => (
        <RoundedBox key={x} args={[0.92, 0.14, 0.62]} radius={0.05} position={[x, 0.5, 0.06]} castShadow>
          <meshStandardMaterial color={color} roughness={0.95} />
        </RoundedBox>
      ))}
    </group>
  )
}

function Armchair({ color }: { color: string }) {
  return (
    <group>
      <Legs w={0.8} d={0.8} h={0.14} />
      <RoundedBox args={[0.9, 0.3, 0.9]} radius={0.07} position={[0, 0.3, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[0.9, 0.42, 0.2]} radius={0.07} position={[0, 0.6, -0.33]} castShadow>
        <meshStandardMaterial color={color} roughness={0.9} />
      </RoundedBox>
      {[-0.38, 0.38].map((x) => (
        <RoundedBox key={x} args={[0.15, 0.26, 0.8]} radius={0.05} position={[x, 0.55, 0]} castShadow>
          <meshStandardMaterial color={color} roughness={0.9} />
        </RoundedBox>
      ))}
      <RoundedBox args={[0.56, 0.1, 0.56]} radius={0.04} position={[0, 0.49, 0.05]} castShadow>
        <meshStandardMaterial color={color} roughness={0.95} />
      </RoundedBox>
    </group>
  )
}

function Chair({ color }: { color: string }) {
  return (
    <group>
      <Legs w={0.46} d={0.46} h={0.44} r={0.02} inset={0.05} />
      <RoundedBox args={[0.5, 0.06, 0.5]} radius={0.02} position={[0, 0.47, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[0.48, 0.42, 0.05]} radius={0.02} position={[0, 0.68, -0.22]} castShadow>
        <meshStandardMaterial color={color} roughness={0.7} />
      </RoundedBox>
    </group>
  )
}

/* ------------------------------- Tables -------------------------------- */

function CoffeeTable({ color }: { color: string }) {
  return (
    <group>
      <Legs w={1.0} d={0.52} h={0.36} r={0.025} />
      <RoundedBox args={[1.1, 0.05, 0.6]} radius={0.02} position={[0, 0.39, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.45} />
      </RoundedBox>
      {/* lower magazine shelf */}
      <RoundedBox args={[0.95, 0.03, 0.48]} radius={0.01} position={[0, 0.14, 0]} castShadow>
        <meshStandardMaterial color={WOOD_DARK} roughness={0.6} />
      </RoundedBox>
    </group>
  )
}

function DiningTable({ color }: { color: string }) {
  return (
    <group>
      <Legs w={1.66} d={0.85} h={0.71} r={0.04} inset={0.1} />
      <RoundedBox args={[1.8, 0.06, 0.95]} radius={0.02} position={[0, 0.74, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.5} />
      </RoundedBox>
    </group>
  )
}

function Desk({ color }: { color: string }) {
  return (
    <group>
      <Legs w={1.32} d={0.62} h={0.72} r={0.03} />
      <RoundedBox args={[1.4, 0.05, 0.7]} radius={0.02} position={[0, 0.745, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.5} />
      </RoundedBox>
      {/* laptop: base + tilted screen (small emissive panel for life) */}
      <M position={[0.15, 0.785, 0.02]}>
        <boxGeometry args={[0.32, 0.02, 0.22]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.6} />
      </M>
      <mesh castShadow position={[0.15, 0.87, -0.1]} rotation={[-0.35, 0, 0]}>
        <boxGeometry args={[0.32, 0.2, 0.012]} />
        <meshStandardMaterial color="#1a1c22" emissive="#4a6e8a" emissiveIntensity={0.55} roughness={0.3} />
      </mesh>
    </group>
  )
}

/* ------------------------------- Bedroom ------------------------------- */

function Bed({ color }: { color: string }) {
  return (
    <group>
      {/* frame + headboard at -z */}
      <RoundedBox args={[1.7, 0.26, 2.1]} radius={0.04} position={[0, 0.2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={WOOD_DARK} roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[1.7, 0.75, 0.1]} radius={0.04} position={[0, 0.48, -1.0]} castShadow>
        <meshStandardMaterial color={WOOD_DARK} roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[1.6, 0.22, 1.95]} radius={0.07} position={[0, 0.43, 0.02]} castShadow>
        <meshStandardMaterial color="#f0ede6" roughness={0.95} />
      </RoundedBox>
      {/* duvet over the lower two thirds */}
      <RoundedBox args={[1.62, 0.12, 1.25]} radius={0.05} position={[0, 0.52, 0.38]} castShadow>
        <meshStandardMaterial color={color} roughness={0.95} />
      </RoundedBox>
      {[-0.4, 0.4].map((x) => (
        <RoundedBox key={x} args={[0.62, 0.14, 0.4]} radius={0.06} position={[x, 0.58, -0.72]} rotation={[0.15, 0, 0]} castShadow>
          <meshStandardMaterial color="#ffffff" roughness={0.95} />
        </RoundedBox>
      ))}
    </group>
  )
}

function Wardrobe({ color }: { color: string }) {
  return (
    <group>
      <RoundedBox args={[1.6, 2.1, 0.65]} radius={0.03} position={[0, 1.05, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.6} />
      </RoundedBox>
      {/* door seam + handles on the +z face */}
      <M position={[0, 1.05, 0.33]}>
        <boxGeometry args={[0.015, 2.0, 0.01]} />
        <meshStandardMaterial color="#00000055" transparent opacity={0.35} />
      </M>
      {[-0.09, 0.09].map((x) => (
        <M key={x} position={[x, 1.05, 0.345]}>
          <cylinderGeometry args={[0.012, 0.012, 0.28, 8]} />
          <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.3} />
        </M>
      ))}
    </group>
  )
}

/* ------------------------------- Storage ------------------------------- */

function Bookshelf({ color }: { color: string }) {
  const rnd = mulberry32(91)
  const bookColors = ['#a65d57', '#4a6e8a', '#c2a284', '#4c7a4f', '#7a6a8a', '#b08d64']
  const shelves = [0.42, 0.85, 1.28]
  return (
    <group>
      {/* open frame: two sides, back, top, bottom */}
      {[-0.435, 0.435].map((x) => (
        <M key={x} position={[x, 0.95, 0]}>
          <boxGeometry args={[0.03, 1.9, 0.35]} />
          <meshStandardMaterial color={color} roughness={0.65} />
        </M>
      ))}
      <M position={[0, 0.95, -0.16]}>
        <boxGeometry args={[0.9, 1.9, 0.025]} />
        <meshStandardMaterial color={color} roughness={0.65} />
      </M>
      {[0.015, 1.885].map((y) => (
        <M key={y} position={[0, y, 0]}>
          <boxGeometry args={[0.9, 0.03, 0.35]} />
          <meshStandardMaterial color={color} roughness={0.65} />
        </M>
      ))}
      {shelves.map((y) => (
        <M key={y} position={[0, y, 0]}>
          <boxGeometry args={[0.84, 0.025, 0.32]} />
          <meshStandardMaterial color={color} roughness={0.65} />
        </M>
      ))}
      {/* books: deterministic little rows standing on each shelf */}
      {[0.03, ...shelves].flatMap((y, si) =>
        Array.from({ length: 6 }, (_, i) => {
          const h = 0.16 + rnd() * 0.1
          const w = 0.035 + rnd() * 0.025
          return (
            <M key={`${si}-${i}`} position={[-0.32 + i * 0.11 + rnd() * 0.02, y + h / 2 + 0.015, 0.02]}>
              <boxGeometry args={[w, h, 0.22]} />
              <meshStandardMaterial color={bookColors[Math.floor(rnd() * bookColors.length)]} roughness={0.85} />
            </M>
          )
        }),
      )}
    </group>
  )
}

function TvStand({ color }: { color: string }) {
  return (
    <group>
      <Legs w={1.5} d={0.4} h={0.1} r={0.02} />
      <RoundedBox args={[1.6, 0.4, 0.45]} radius={0.03} position={[0, 0.3, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.55} />
      </RoundedBox>
      {/* TV panel */}
      <M position={[0, 0.95, -0.05]}>
        <boxGeometry args={[1.25, 0.72, 0.04]} />
        <meshStandardMaterial color="#101114" roughness={0.4} metalness={0.3} />
      </M>
      <mesh position={[0, 0.95, -0.028]}>
        <planeGeometry args={[1.18, 0.65]} />
        <meshStandardMaterial color="#0c0f16" emissive="#22344a" emissiveIntensity={0.7} roughness={0.25} />
      </mesh>
    </group>
  )
}

function KitchenIsland({ color }: { color: string }) {
  return (
    <group>
      <RoundedBox args={[1.76, 0.88, 0.86]} radius={0.02} position={[0, 0.44, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.7} />
      </RoundedBox>
      {/* stone countertop with slight overhang */}
      <RoundedBox args={[1.86, 0.05, 0.96]} radius={0.015} position={[0, 0.915, 0]} castShadow>
        <meshStandardMaterial color="#e9e7e2" roughness={0.25} />
      </RoundedBox>
      {/* drawer fronts */}
      {[-0.45, 0.45].map((x) =>
        [0.28, 0.62].map((y) => (
          <M key={`${x}-${y}`} position={[x, y, 0.435]}>
            <boxGeometry args={[0.78, 0.28, 0.015]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </M>
        )),
      )}
      {[-0.45, 0.45].map((x) => (
        <M key={x} position={[x, 0.78, 0.45]}>
          <boxGeometry args={[0.3, 0.02, 0.02]} />
          <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.3} />
        </M>
      ))}
    </group>
  )
}

/* --------------------------- Lighting & decor --------------------------- */

function FloorLamp({ color }: { color: string }) {
  return (
    <group>
      <mesh castShadow position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.03, 20]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh castShadow position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.4, 8]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.5} />
      </mesh>
      {/* shade + warm emissive bulb (picked up by bloom) */}
      <mesh castShadow position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.14, 0.19, 0.28, 20, 1, true]} />
        <meshStandardMaterial color="#f2ead9" roughness={0.9} side={2} />
      </mesh>
      <mesh position={[0, 1.47, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#fff6dd" emissive="#ffd9a0" emissiveIntensity={2.6} />
      </mesh>
      <pointLight position={[0, 1.45, 0]} intensity={3.2} distance={4.5} decay={2} color="#ffd9a0" castShadow={false} />
    </group>
  )
}

function Plant({ color }: { color: string }) {
  const rnd = mulberry32(53)
  return (
    <group>
      <mesh castShadow position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.16, 0.12, 0.32, 16]} />
        <meshStandardMaterial color="#c9bfae" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.33, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.03, 16]} />
        <meshStandardMaterial color="#5a4a38" roughness={1} />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2
        const r = 0.07 + rnd() * 0.05
        return (
          <mesh key={i} castShadow position={[Math.cos(a) * r, 0.62 + rnd() * 0.35, Math.sin(a) * r]}>
            <icosahedronGeometry args={[0.16 + rnd() * 0.1, 0]} />
            <meshStandardMaterial color={color} roughness={0.9} flatShading />
          </mesh>
        )
      })}
    </group>
  )
}

function Rug({ color }: { color: string }) {
  return (
    <group>
      <mesh receiveShadow position={[0, 0.008, 0]}>
        <boxGeometry args={[2.4, 0.016, 1.7]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      <mesh receiveShadow position={[0, 0.017, 0]}>
        <boxGeometry args={[2.1, 0.002, 1.4]} />
        <meshStandardMaterial color="#ffffff" opacity={0.16} transparent roughness={1} />
      </mesh>
    </group>
  )
}

/* ------------------------------ Dispatcher ------------------------------ */

const MODELS: Record<FurnitureType, (props: { color: string }) => JSX.Element> = {
  sofa: Sofa,
  armchair: Armchair,
  chair: Chair,
  coffeeTable: CoffeeTable,
  diningTable: DiningTable,
  desk: Desk,
  bed: Bed,
  wardrobe: Wardrobe,
  bookshelf: Bookshelf,
  tvStand: TvStand,
  kitchenIsland: KitchenIsland,
  floorLamp: FloorLamp,
  plant: Plant,
  rug: Rug,
}

/** Renders the procedural model for a furniture item (memoized on type/color). */
export const FurnitureModel = memo(function FurnitureModel({ item }: { item: FurnitureItem }) {
  const def = getFurnitureDef(item.type)
  const Model = MODELS[item.type]
  return <Model color={item.color ?? def.defaultColor} />
})
