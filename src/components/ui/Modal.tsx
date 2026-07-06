import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { IconButton } from './IconButton'

interface ModalProps {
  title: string
  open: boolean
  onClose: () => void
  children: ReactNode
}

/**
 * Centered dialog with backdrop blur, focus trapping and focus restore.
 * Esc is handled globally (useKeyboardShortcuts) so behavior stays consistent.
 */
export function Modal({ title, open, onClose, children }: ModalProps) {
  const trapRef = useFocusTrap<HTMLDivElement>(open)

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden />
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="glass relative max-h-[85dvh] w-full max-w-lg overflow-y-auto p-6 animate-fade-in"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-neutral-900 dark:text-white">{title}</h2>
          <IconButton label="Close" onClick={onClose}>
            <X size={17} />
          </IconButton>
        </div>
        {children}
      </div>
    </div>
  )
}
