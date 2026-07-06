import { SHORTCUT_GROUPS } from '../../constants/shortcuts'
import { useStore } from '../../store'
import { Kbd } from '../ui/Kbd'
import { Modal } from '../ui/Modal'

/** Keyboard reference dialog (open with "?"). */
export function ShortcutsModal() {
  const open = useStore((s) => s.activeModal === 'shortcuts')
  const setActiveModal = useStore((s) => s.setActiveModal)

  return (
    <Modal title="Keyboard shortcuts" open={open} onClose={() => setActiveModal(null)}>
      <div className="grid gap-6 sm:grid-cols-2">
        {SHORTCUT_GROUPS.map((group) => (
          <section key={group.title}>
            <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
              {group.title}
            </h3>
            <ul className="space-y-2">
              {group.items.map((item) => (
                <li key={item.label} className="flex items-center justify-between gap-3">
                  <span className="text-[13px] text-neutral-600 dark:text-neutral-300">{item.label}</span>
                  <span className="flex shrink-0 items-center gap-1">
                    {item.keys.map((k, i) => (
                      <Kbd key={i}>{k}</Kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Modal>
  )
}
