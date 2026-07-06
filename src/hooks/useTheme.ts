import { useEffect } from 'react'
import { useStore } from '../store'

/**
 * Applies theme + contrast preferences to the <html> element.
 * Tailwind's `dark:` variants key off the `dark` class; the `hc`
 * class drives the high-contrast overrides in index.css.
 */
export function useTheme(): void {
  const theme = useStore((s) => s.theme)
  const highContrast = useStore((s) => s.highContrast)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('hc', highContrast)
    root.style.colorScheme = theme
  }, [theme, highContrast])
}
