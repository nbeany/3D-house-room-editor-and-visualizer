import { useEffect } from 'react'
import { useStore } from '../store'

/**
 * Global keyboard shortcuts.
 * Reads store state imperatively via getState() so the handler never
 * holds stale closures and this hook subscribes to nothing.
 * See constants/shortcuts.ts for the user-facing reference.
 */
export function useKeyboardShortcuts(): void {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const s = useStore.getState()
      const target = e.target as HTMLElement | null

      // Never hijack typing in form controls.
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      // While pointer-locked in first person, only Esc (handled by the browser) applies.
      if (s.fpLocked) return

      const mod = e.ctrlKey || e.metaKey

      // ---- Undo / redo -------------------------------------------------
      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        if (e.shiftKey) s.redo()
        else s.undo()
        return
      }
      if (mod && e.key.toLowerCase() === 'y') {
        e.preventDefault()
        s.redo()
        return
      }
      if (mod) return // don't shadow browser shortcuts (Ctrl+R etc.)

      switch (e.key) {
        // ---- Escape: close modal → exit tool → deselect ----------------
        case 'Escape':
          if (s.activeModal) s.setActiveModal(null)
          else if (s.tool !== 'select') s.setTool('select')
          else s.select(null)
          return

        // ---- Selection editing -----------------------------------------
        case 'Delete':
        case 'Backspace':
          if (s.selectedId) {
            e.preventDefault()
            s.removeFurniture(s.selectedId)
          }
          return

        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight': {
          if (!s.selectedId) return
          e.preventDefault()
          const item = s.furniture.find((f) => f.id === s.selectedId)
          if (!item) return
          const step = e.shiftKey ? 0.5 : 0.1
          const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0
          const dz = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0
          s.moveFurniture(item.id, item.x + dx, item.z + dz, true)
          return
        }
      }

      switch (e.key.toLowerCase()) {
        case 'r':
          if (s.selectedId) s.rotateFurniture(s.selectedId, e.shiftKey ? -15 : 15)
          return
        case 'd':
          if (s.selectedId) s.duplicateFurniture(s.selectedId)
          return
        case 'm':
          s.setTool(s.tool === 'measure' ? 'select' : 'measure')
          return
        case 'g':
          s.toggleGrid()
          return
        case 't':
          s.setHouse({ showRoof: !s.house.showRoof })
          return
        case 'f':
          s.setCameraMode(s.cameraMode === 'firstPerson' ? 'orbit' : 'firstPerson')
          return
        case '1':
          s.setCameraMode('orbit')
          return
        case '2':
          s.setCameraMode('top')
          return
        case '3':
          s.setCameraMode('front')
          return
        case '?':
          s.setActiveModal(s.activeModal === 'shortcuts' ? null : 'shortcuts')
          return
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
