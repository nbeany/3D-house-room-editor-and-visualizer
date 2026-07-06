import { useId } from 'react'

interface ToggleProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  hint?: string
  disabled?: boolean
}

/** iOS-style switch with a proper switch role and label association. */
export function Toggle({ label, checked, onChange, hint, disabled }: ToggleProps) {
  const id = useId()
  return (
    <div className={`flex items-center justify-between gap-3 ${disabled ? 'opacity-40' : ''}`}>
      <div className="min-w-0">
        <label htmlFor={id} className="block cursor-pointer text-[13px] font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
        {hint && <p className="mt-0.5 text-[11px] leading-snug text-neutral-400 dark:text-neutral-500">{hint}</p>}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={
          'relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200 ' +
          (checked ? 'bg-accent' : 'bg-black/[0.15] dark:bg-white/[0.18]')
        }
      >
        <span
          aria-hidden
          className={
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ' +
            (checked ? 'translate-x-[18px]' : 'translate-x-0.5')
          }
        />
      </button>
    </div>
  )
}
