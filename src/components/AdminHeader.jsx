import { Plus, SignOut } from '@phosphor-icons/react'

export default function AdminHeader({ userEmail, onAddItem, onLogout }) {
  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 py-3 backdrop-blur"
      style={{
        background: 'color-mix(in srgb, var(--bg) 92%, transparent)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="min-w-0">
        <p className="text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: 'var(--text-muted)' }}>
          Terminal 8
        </p>
        <h1 className="text-[18px] font-bold leading-tight" style={{ color: 'var(--text)' }}>
          Menu Admin
        </h1>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onAddItem}
          className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition active:scale-[0.98]"
          style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
        >
          <Plus size={16} weight="bold" />
          Add item
        </button>
        <button
          type="button"
          onClick={onLogout}
          title={userEmail}
          aria-label="Sign out"
          className="flex h-9 w-9 items-center justify-center rounded-full transition"
          style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
        >
          <SignOut size={16} weight="bold" />
        </button>
      </div>
    </header>
  )
}
