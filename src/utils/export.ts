import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { sceneRefs } from './three/sceneRefs'
import type { ProjectFile } from '../types'

/* ============================================================
 * Export pipeline: PNG screenshot, JSON configuration and a
 * binary GLTF (.glb) of the visible scene. All exports are pure
 * client-side downloads — no server involved.
 * ============================================================ */

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  // Give the browser a tick to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

const stamp = () => new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')

/** Captures the WebGL canvas as a PNG (requires preserveDrawingBuffer, set on the Canvas). */
export function exportPNG(): boolean {
  const gl = sceneRefs.gl
  if (!gl) return false
  gl.domElement.toBlob((blob) => {
    if (blob) download(blob, `maison-${stamp()}.png`)
  }, 'image/png')
  return true
}

/** Serializes the current configuration to a versioned JSON file. */
export function exportJSON(data: Omit<ProjectFile, 'app' | 'version' | 'savedAt'>): void {
  const file: ProjectFile = {
    app: 'maison-3d',
    version: 1,
    savedAt: new Date().toISOString(),
    ...data,
  }
  download(new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' }), `maison-${stamp()}.json`)
}

/** Parses + validates an imported project file; throws with a friendly message. */
export function parseProjectFile(text: string): ProjectFile {
  const data = JSON.parse(text) as ProjectFile
  if (data?.app !== 'maison-3d' || !data.house || !data.materials || !Array.isArray(data.furniture)) {
    throw new Error('Not a valid Maison project file')
  }
  return data
}

/** Exports the house + furniture group as a binary GLTF (.glb). */
export function exportGLTF(): boolean {
  const group = sceneRefs.exportGroup
  if (!group) return false
  const exporter = new GLTFExporter()
  exporter.parse(
    group,
    (result) => {
      const blob =
        result instanceof ArrayBuffer
          ? new Blob([result], { type: 'model/gltf-binary' })
          : new Blob([JSON.stringify(result)], { type: 'model/gltf+json' })
      download(blob, `maison-${stamp()}.glb`)
    },
    (err) => console.error('GLTF export failed', err),
    { binary: true },
  )
  return true
}
