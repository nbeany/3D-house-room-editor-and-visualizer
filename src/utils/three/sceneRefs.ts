import type * as THREE from 'three'

/* ============================================================
 * Imperative bridge between the R3F canvas and the DOM UI.
 * SceneBridge (inside the canvas) populates these refs; export
 * utilities and panels (outside the canvas) consume them without
 * causing any React re-renders.
 * ============================================================ */

interface SceneRefs {
  gl: THREE.WebGLRenderer | null
  scene: THREE.Scene | null
  camera: THREE.Camera | null
  /** Group containing only exportable content (house + furniture + garden). */
  exportGroup: THREE.Group | null
}

export const sceneRefs: SceneRefs = {
  gl: null,
  scene: null,
  camera: null,
  exportGroup: null,
}
