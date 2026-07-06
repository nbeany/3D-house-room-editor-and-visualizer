import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required for accessibility — also shown as the tooltip. */
  label: string
  active?: boolean
  children: ReactNode
  /** Tooltip placement relative to the button. */
  tipSide?: 'top' | 'bottom'
}

/**
 * Square icon button with a pure-CSS tooltip (see [data-tip] styles in
 * index.css). `label` doubles as aria-label so every icon control is
 * screen-reader friendly by construction.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, active = false, tipSide = 'bottom', className = '', children, ...rest }, ref) => (
    <button
      ref={ref}
      aria-label={label}
      aria-pressed={rest['aria-pressed'] ?? (active || undefined)}
      data-tip={label}
      data-tip-side={tipSide}
      className={
        'relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-150 ' +
        'active:scale-[0.94] disabled:pointer-events-none disabled:opacity-40 ' +
        (active
          ? 'bg-accent/15 text-accent dark:bg-accent/25 dark:text-accent-soft '
          : 'text-neutral-500 hover:bg-black/[0.06] hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/[0.09] dark:hover:text-white ') +
        className
      }
      {...rest}
    >
      {children}
    </button>
  ),
)
IconButton.displayName = 'IconButton'
