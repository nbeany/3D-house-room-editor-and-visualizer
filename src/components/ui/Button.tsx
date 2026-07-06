import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-1.5 rounded-xl font-medium transition-all duration-150 ' +
  'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 select-none whitespace-nowrap'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white shadow-sm hover:bg-accent-strong',
  secondary:
    'bg-black/[0.05] text-neutral-800 hover:bg-black/[0.09] dark:bg-white/[0.08] dark:text-neutral-100 dark:hover:bg-white/[0.14]',
  ghost:
    'text-neutral-600 hover:bg-black/[0.05] hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/[0.08] dark:hover:text-white',
  danger: 'bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-4 text-sm',
}

/** Standard button — the only place button chrome is defined. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', icon, className = '', children, ...rest }, ref) => (
    <button ref={ref} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {icon}
      {children}
    </button>
  ),
)
Button.displayName = 'Button'
