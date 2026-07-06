/** Keyboard key cap used in the shortcuts modal and hints. */
export function Kbd({ children }: { children: string }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-black/[0.1] bg-white px-1.5 text-[11px] font-semibold text-neutral-600 shadow-[0_1px_0_rgba(0,0,0,0.08)] dark:border-white/[0.12] dark:bg-neutral-800 dark:text-neutral-300">
      {children}
    </kbd>
  )
}
