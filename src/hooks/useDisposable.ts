import { useEffect, useMemo, useRef } from 'react'

interface Disposable {
  dispose: () => void
}

/**
 * useMemo for three.js resources (geometries/materials) with correct cleanup.
 * R3F does not dispose objects you create yourself when the memo dependencies
 * change, so rebuilding walls on every slider tick would leak GPU buffers.
 * This hook disposes the previous resource whenever a new one is created and
 * on unmount.
 */
export function useDisposable<T extends Disposable>(factory: () => T, deps: unknown[]): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(factory, deps)
  const previous = useRef<T | null>(null)

  useEffect(() => {
    if (previous.current && previous.current !== value) previous.current.dispose()
    previous.current = value
    return () => {
      previous.current?.dispose()
      previous.current = null
    }
  }, [value])

  return value
}
