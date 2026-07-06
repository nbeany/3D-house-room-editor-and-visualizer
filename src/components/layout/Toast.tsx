import { useEffect } from 'react'
import { useStore } from '../../store'

const TOAST_MS = 2600

/** Transient status messages (exports, tips). Announced politely to screen readers. */
export function Toast() {
  const toast = useStore((s) => s.toast)
  const clearToast = useStore((s) => s.clearToast)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(clearToast, TOAST_MS)
    return () => clearTimeout(t)
  }, [toast, clearToast])

  return (
    <div role="status" aria-live="polite" className="pointer-events-none absolute inset-x-0 bottom-20 z-50 flex justify-center px-4">
      {toast && (
        <div
          key={toast.id}
          className="glass max-w-sm truncate px-4 py-2.5 text-[13px] font-medium text-neutral-800 dark:text-neutral-100 animate-fade-in"
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}
