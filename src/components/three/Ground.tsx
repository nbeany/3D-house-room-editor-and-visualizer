import { Grid } from '@react-three/drei'
import { memo } from 'react'
import { useStore } from '../../store'

/**
 * Terrain: lawn disc, entry path and the toggleable shader grid.
 * Clicking empty ground clears the selection (furniture meshes
 * stop propagation, and the measure tool overlays its own plane).
 */
export const Ground = memo(function Ground() {
  const showGrid = useStore((s) => s.showGrid)
  const depth = useStore((s) => s.house.depth)

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation()
          const s = useStore.getState()
          if (s.tool === 'select' && !s.draggingId) s.select(null)
        }}
      >
        <circleGeometry args={[46, 64]} />
        <meshStandardMaterial color="#729465" roughness={1} />
      </mesh>
      {/* subtle darker rim reads as depth at the horizon */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
        <circleGeometry args={[70, 64]} />
        <meshStandardMaterial color="#5d7a54" roughness={1} />
      </mesh>

      {/* paved path from the entry door */}
      <mesh position={[0, 0.005, depth / 2 + 2.1]} receiveShadow>
        <boxGeometry args={[1.7, 0.05, 3.6]} />
        <meshStandardMaterial color="#b3b0a9" roughness={0.85} />
      </mesh>

      {showGrid && (
        <Grid
          position={[0, 0.03, 0]}
          args={[10, 10]}
          infiniteGrid
          cellSize={1}
          sectionSize={5}
          cellThickness={0.6}
          sectionThickness={1.1}
          cellColor="#7d9873"
          sectionColor="#aebfa6"
          fadeDistance={46}
          fadeStrength={2.5}
          followCamera={false}
        />
      )}
    </group>
  )
})
