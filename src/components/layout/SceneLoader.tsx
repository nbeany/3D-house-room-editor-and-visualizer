import { Home } from 'lucide-react'

/** Suspense fallback while the code-split 3D bundle loads. */
export function SceneLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-sky-100 to-emerald-50 dark:from-neutral-900 dark:to-neutral-950" role="status" aria-label="Loading 3D engine">
      <div className="flex flex-col items-center gap-3">
        <span className="flex h-14 w-14 animate-shimmer items-center justify-center rounded-2xl bg-accent text-white shadow-panel">
          <Home size={26} strokeWidth={2.2} />
        </span>
        <p className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400">Loading 3D engine…</p>
      </div>
    </div>
  )
}
