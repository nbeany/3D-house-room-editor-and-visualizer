import { useId } from 'react'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  /** Formats the value badge (default: raw number). */
  format?: (value: number) => string
  disabled?: boolean
}

/**
 * Labeled range slider. Uses the native input for full keyboard and
 * screen-reader support; visual style lives in index.css (.slider).
 */
export function Slider({ label, value, min, max, step, onChange, format, disabled }: SliderProps) {
  const id = useId()
  return (
    <div className={disabled ? 'opacity-40' : ''}>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={id} className="text-[13px] font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
        <span className="rounded-md bg-black/[0.05] px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-neutral-600 dark:bg-white/[0.08] dark:text-neutral-300">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        className="slider"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-valuetext={format ? format(value) : String(value)}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}
