import * as THREE from 'three'
import { mulberry32 } from '../rng'

/* ============================================================
 * Procedural CanvasTextures.
 * Each painter draws ONE square meter of *grayscale* detail into
 * an opaque canvas. The texture is used as a multiply map on top
 * of the material's base color, so the same brick/plank pattern
 * tints correctly for any catalog color. Geometry UVs are
 * authored in meters, so RepeatWrapping tiles these at any wall
 * or floor size. Zero binary assets shipped.
 * Textures are cached per id — created once, shared everywhere.
 * ============================================================ */

type Painter = (ctx: CanvasRenderingContext2D, size: number) => void

const SIZE = 256
const cache = new Map<string, THREE.CanvasTexture>()

/** Fills with a gray level where 1.0 = no darkening when multiplied. */
function gray(level: number): string {
  const v = Math.round(Math.min(1, Math.max(0, level)) * 255)
  return `rgb(${v},${v},${v})`
}

function makeTexture(id: string, painter: Painter): THREE.CanvasTexture {
  const cached = cache.get(id)
  if (cached) return cached

  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = gray(0.95)
  ctx.fillRect(0, 0, SIZE, SIZE) // opaque base — transparent pixels would multiply to black
  painter(ctx, SIZE)

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  cache.set(id, tex)
  return tex
}

/** Sparse per-pixel noise pass used by several painters. */
function speckle(ctx: CanvasRenderingContext2D, size: number, alpha: number, seed: number) {
  const rnd = mulberry32(seed)
  for (let i = 0; i < 900; i++) {
    const shade = rnd() > 0.5 ? 255 : 0
    ctx.fillStyle = `rgba(${shade},${shade},${shade},${(alpha * rnd()).toFixed(3)})`
    ctx.fillRect(rnd() * size, rnd() * size, 1.5, 1.5)
  }
}

const painters: Record<string, Painter> = {
  // Running-bond brick: 8 courses per meter, light mortar joints.
  brick: (ctx, s) => {
    ctx.fillStyle = gray(1.0) // mortar
    ctx.fillRect(0, 0, s, s)
    const rows = 8
    const cols = 4
    const bh = s / rows
    const rnd = mulberry32(7)
    for (let r = 0; r < rows; r++) {
      const offset = r % 2 === 0 ? 0 : s / cols / 2
      for (let c = -1; c < cols + 1; c++) {
        ctx.fillStyle = gray(0.72 + rnd() * 0.24)
        ctx.fillRect(c * (s / cols) + offset + 1.5, r * bh + 1.5, s / cols - 3, bh - 3)
      }
    }
    speckle(ctx, s, 0.05, 21)
  },

  // Vertical boards with seams and grain.
  planks: (ctx, s) => {
    const boards = 5
    const bw = s / boards
    const rnd = mulberry32(11)
    for (let i = 0; i < boards; i++) {
      ctx.fillStyle = gray(0.82 + rnd() * 0.18)
      ctx.fillRect(i * bw, 0, bw, s)
      ctx.fillStyle = 'rgba(0,0,0,0.28)'
      ctx.fillRect(i * bw, 0, 1.5, s)
      ctx.strokeStyle = 'rgba(0,0,0,0.10)'
      for (let g = 0; g < 6; g++) {
        ctx.beginPath()
        const x = i * bw + rnd() * bw
        ctx.moveTo(x, 0)
        ctx.bezierCurveTo(x + rnd() * 6 - 3, s * 0.33, x + rnd() * 6 - 3, s * 0.66, x, s)
        ctx.stroke()
      }
    }
  },

  concrete: (ctx, s) => {
    ctx.fillStyle = gray(0.93)
    ctx.fillRect(0, 0, s, s)
    speckle(ctx, s, 0.1, 31)
    ctx.strokeStyle = 'rgba(0,0,0,0.08)'
    ctx.strokeRect(0.5, 0.5, s - 1, s - 1)
  },

  // Coursed stone blocks with irregular widths.
  stone: (ctx, s) => {
    ctx.fillStyle = gray(1.0) // joints
    ctx.fillRect(0, 0, s, s)
    const rows = 4
    const rnd = mulberry32(17)
    for (let r = 0; r < rows; r++) {
      let x = r % 2 === 0 ? 0 : -s / 6
      while (x < s) {
        const w = s / 4 + rnd() * (s / 5)
        ctx.fillStyle = gray(0.75 + rnd() * 0.25)
        ctx.fillRect(x + 2, r * (s / rows) + 2, w - 4, s / rows - 4)
        x += w
      }
    }
    speckle(ctx, s, 0.06, 41)
  },

  // 2×2 tiles per meter with thin darker grout.
  tile: (ctx, s) => {
    ctx.fillStyle = gray(0.72) // grout
    ctx.fillRect(0, 0, s, s)
    const n = 2
    const tw = s / n
    const rnd = mulberry32(23)
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        ctx.fillStyle = gray(0.94 + rnd() * 0.06)
        ctx.fillRect(i * tw + 1.5, j * tw + 1.5, tw - 3, tw - 3)
      }
    }
  },

  marble: (ctx, s) => {
    ctx.fillStyle = gray(0.98)
    ctx.fillRect(0, 0, s, s)
    const rnd = mulberry32(29)
    ctx.strokeStyle = 'rgba(0,0,0,0.16)'
    for (let v = 0; v < 7; v++) {
      ctx.lineWidth = 0.5 + rnd() * 1.4
      ctx.beginPath()
      let x = rnd() * s
      let y = 0
      ctx.moveTo(x, y)
      while (y < s) {
        x += (rnd() - 0.5) * 40
        y += 12 + rnd() * 22
        ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  },

  // Horizontal shingle courses with staggered tabs and shadow lines.
  shingles: (ctx, s) => {
    const rows = 6
    const rh = s / rows
    const rnd = mulberry32(37)
    for (let r = 0; r < rows; r++) {
      const offset = r % 2 === 0 ? 0 : s / 8
      for (let c = -1; c < 5; c++) {
        ctx.fillStyle = gray(0.82 + rnd() * 0.18)
        ctx.fillRect(c * (s / 4) + offset, r * rh, s / 4 - 1.5, rh - 1.5)
      }
      ctx.fillStyle = 'rgba(0,0,0,0.4)'
      ctx.fillRect(0, r * rh, s, 2)
    }
  },

  // Standing-seam metal: vertical ribs with highlight + shadow.
  metalSeam: (ctx, s) => {
    ctx.fillStyle = gray(0.92)
    ctx.fillRect(0, 0, s, s)
    const seams = 3
    for (let i = 0; i <= seams; i++) {
      const x = (i * s) / seams
      ctx.fillStyle = gray(1.0)
      ctx.fillRect(x - 2, 0, 3, s)
      ctx.fillStyle = 'rgba(0,0,0,0.22)'
      ctx.fillRect(x + 1.5, 0, 2, s)
    }
  },
}

/** Returns the shared CanvasTexture for a painter id, or null for flat materials. */
export function getProceduralTexture(id?: string): THREE.CanvasTexture | null {
  if (!id) return null
  const painter = painters[id]
  if (!painter) return null
  return makeTexture(id, painter)
}
