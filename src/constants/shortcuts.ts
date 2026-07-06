/** Keyboard shortcut reference — rendered in the Shortcuts modal and implemented in hooks/useKeyboardShortcuts. */

export interface ShortcutDef {
  keys: string[]
  label: string
}

export interface ShortcutGroup {
  title: string
  items: ShortcutDef[]
}

export const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'General',
    items: [
      { keys: ['Ctrl', 'Z'], label: 'Undo' },
      { keys: ['Ctrl', 'Shift', 'Z'], label: 'Redo' },
      { keys: ['?'], label: 'Show keyboard shortcuts' },
      { keys: ['Esc'], label: 'Deselect · exit tool · close dialog' },
    ],
  },
  {
    title: 'Camera',
    items: [
      { keys: ['1'], label: 'Orbit view' },
      { keys: ['2'], label: 'Top view' },
      { keys: ['3'], label: 'Front view' },
      { keys: ['F'], label: 'First-person walkthrough' },
      { keys: ['W', 'A', 'S', 'D'], label: 'Walk (first-person)' },
      { keys: ['Shift'], label: 'Run (first-person)' },
    ],
  },
  {
    title: 'Furniture',
    items: [
      { keys: ['R'], label: 'Rotate selection 15°' },
      { keys: ['Shift', 'R'], label: 'Rotate selection −15°' },
      { keys: ['↑', '↓', '←', '→'], label: 'Nudge selection 0.1 m' },
      { keys: ['Shift', '↑'], label: 'Nudge selection 0.5 m' },
      { keys: ['D'], label: 'Duplicate selection' },
      { keys: ['Del'], label: 'Delete selection' },
      { keys: ['Alt', 'drag'], label: 'Disable grid snapping while dragging' },
    ],
  },
  {
    title: 'Scene',
    items: [
      { keys: ['M'], label: 'Measure tool' },
      { keys: ['G'], label: 'Toggle ground grid' },
      { keys: ['T'], label: 'Toggle roof visibility' },
    ],
  },
]
