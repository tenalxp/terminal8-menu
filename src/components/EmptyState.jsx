import { MagnifyingGlass } from '@phosphor-icons/react'

export default function EmptyState({ message = 'No dishes found', hint }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center px-6">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: 'var(--surface-2)' }}
      >
        <MagnifyingGlass size={22} weight="light" style={{ color: 'var(--text-muted)' }} />
      </div>
      <p className="text-[15px] font-medium" style={{ color: 'var(--text)' }}>
        {message}
      </p>
      {hint && (
        <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
          {hint}
        </p>
      )}
    </div>
  )
}
