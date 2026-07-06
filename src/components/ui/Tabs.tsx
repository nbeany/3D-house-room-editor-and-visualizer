import type { ReactNode } from 'react'

export interface TabDef<T extends string> {
  id: T
  label: string
  icon: ReactNode
}

interface TabsProps<T extends string> {
  tabs: TabDef<T>[]
  active: T
  onChange: (id: T) => void
}

/** Accessible icon tab strip used by the sidebar (and mobile bottom nav). */
export function Tabs<T extends string>({ tabs, active, onChange }: TabsProps<T>) {
  return (
    <div role="tablist" aria-label="Configurator sections" className="flex gap-1 rounded-2xl bg-black/[0.04] p-1 dark:bg-white/[0.06]">
      {tabs.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={
              'flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl text-[12px] font-semibold transition-all duration-150 ' +
              (isActive
                ? 'bg-white text-accent shadow-sm dark:bg-neutral-700 dark:text-accent-soft'
                : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200')
            }
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
