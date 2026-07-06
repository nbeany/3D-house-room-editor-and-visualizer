import type { ReactNode } from 'react'

export interface SegmentOption<T extends string> {
  value: T
  label: string
  icon?: ReactNode
}

interface SegmentedControlProps<T extends string> {
  label: string
  options: SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
  /** Hide text labels and rely on tooltips (compact toolbars). */
  iconOnly?: boolean
}

/** Apple-style segmented control, implemented as an accessible radiogroup. */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  iconOnly = false,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex w-full gap-0.5 rounded-xl bg-black/[0.05] p-0.5 dark:bg-white/[0.07]"
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            aria-label={iconOnly ? opt.label : undefined}
            data-tip={iconOnly ? opt.label : undefined}
            data-tip-side="bottom"
            onClick={() => onChange(opt.value)}
            className={
              'relative flex h-8 flex-1 items-center justify-center gap-1.5 rounded-[10px] text-[12.5px] font-medium transition-all duration-150 ' +
              (active
                ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white'
                : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200')
            }
          >
            {opt.icon}
            {!iconOnly && <span>{opt.label}</span>}
          </button>
        )
      })}
    </div>
  )
}
