import { useEffect, useState } from 'react'

/** Reactive media-query hook. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', onChange)
    setMatches(mql.matches)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

/**
 * Layout breakpoints (aligned with Tailwind's md/xl):
 *   mobile  < 768px   → bottom-sheet panels
 *   tablet  < 1280px  → overlay sidebar
 *   desktop ≥ 1280px  → persistent sidebar + inspector
 */
export function useBreakpoint(): Breakpoint {
  const isDesktop = useMediaQuery('(min-width: 1280px)')
  const isTablet = useMediaQuery('(min-width: 768px)')
  if (isDesktop) return 'desktop'
  if (isTablet) return 'tablet'
  return 'mobile'
}
