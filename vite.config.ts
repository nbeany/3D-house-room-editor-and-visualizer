import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite configuration.
 *
 * Code splitting: three.js and the R3F ecosystem are split into their own
 * vendor chunks so the initial UI shell loads fast; the 3D scene itself is
 * additionally lazy-loaded via React.lazy (see App.tsx).
 */
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          // Order matters: match the R3F ecosystem before the bare "three" package,
          // because packages like "three-stdlib" also contain the substring "three".
          if (
            /@react-three|three-stdlib|postprocessing|camera-controls|maath|troika|detect-gpu|zustand-?traverse/.test(
              id,
            )
          ) {
            return 'r3f'
          }
          if (/node_modules[\\/]three[\\/]/.test(id)) return 'three'
          return 'vendor'
        },
      },
    },
  },
})
