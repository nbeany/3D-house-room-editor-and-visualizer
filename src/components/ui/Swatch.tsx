import { Check } from 'lucide-react'

interface SwatchProps {
  color: string
  label: string
  selected: boolean
  onSelect: () => void
  /** Larger variant with a visible label row underneath (materials panel). */
  size?: 'sm' | 'lg'
}

/** Color/material swatch with selection state, tooltip and aria wiring. */
export function Swatch({ color, label, selected, onSelect, size = 'sm' }: SwatchProps) {
  const dim = size === 'lg' ? 'h-12 w-full' : 'h-7 w-7'
  return (
    <button
      onClick={onSelect}
      aria-label={label}
      aria-pressed={selected}
      data-tip={size === 'sm' ? label : undefined}
      data-tip-side="top"
      className={
        `relative ${dim} rounded-xl transition-all duration-150 active:scale-95 ` +
        (selected
          ? 'ring-2 ring-accent ring-offset-2 ring-offset-white dark:ring-offset-neutral-900'
          : 'ring-1 ring-black/[0.08] hover:ring-black/[0.25] dark:ring-white/[0.12] dark:hover:ring-white/[0.35]')
      }
      style={{ backgroundColor: color }}
    >
      {selected && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Check size={size === 'lg' ? 18 : 13} strokeWidth={3} className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
        </span>
      )}
    </button>
  )
}
