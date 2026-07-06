import type { ReactNode } from 'react'

interface SectionProps {
  title: string
  children: ReactNode
  /** Optional element rendered on the right of the header (e.g. a value). */
  aside?: ReactNode
}

/** Panel section with the small-caps header used across all sidebars. */
export function Section({ title, children, aside }: SectionProps) {
  return (
    <section className="mb-5 last:mb-0">
      <div className="mb-2.5 flex items-center justify-between px-0.5">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">
          {title}
        </h3>
        {aside}
      </div>
      <div className="space-y-3.5">{children}</div>
    </section>
  )
}
