import { Warning } from '@phosphor-icons/react'
import ModalShell from './ModalShell'

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  danger = false,
  onConfirm,
  onCancel,
}) {
  return (
    <ModalShell open={open} onDismiss={onCancel}>
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{
            background: danger ? 'var(--danger-soft)' : 'var(--accent-soft)',
            color: danger ? 'var(--danger)' : 'var(--accent)',
          }}
        >
          <Warning size={20} weight="bold" />
        </div>
        <div>
          <p className="font-semibold" style={{ color: 'var(--text)' }}>
            {title}
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            {message}
          </p>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-4 py-2 text-sm font-medium transition active:scale-[0.98]"
          style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-full px-4 py-2 text-sm font-semibold transition active:scale-[0.98]"
          style={{ background: danger ? 'var(--danger)' : 'var(--accent)', color: 'var(--on-accent)' }}
        >
          {confirmLabel}
        </button>
      </div>
    </ModalShell>
  )
}
