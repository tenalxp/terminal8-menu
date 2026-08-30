import { MagnifyingGlass, X } from '@phosphor-icons/react'

export default function SearchBar({ value, onChange }) {
  return (
    <div
      className="flex items-center gap-2 rounded-full px-4 py-2.5 border transition-colors focus-within:border-[var(--accent)]"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <MagnifyingGlass size={18} weight="bold" style={{ color: 'var(--text-muted)' }} />
      <input
        type="text"
        inputMode="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search dishes"
        className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-[var(--text-muted)]"
        style={{ color: 'var(--text)' }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="shrink-0 rounded-full p-0.5 transition-opacity active:scale-90"
          style={{ color: 'var(--text-muted)' }}
        >
          <X size={16} weight="bold" />
        </button>
      )}
    </div>
  )
}
