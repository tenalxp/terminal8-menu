export default function CategoryTabs({ categories, active, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none px-4 py-2.5 -mx-4">
      {categories.map((category) => {
        const isActive = category === active
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className="shrink-0 rounded-full px-4 py-2 text-[14px] font-medium transition-colors duration-200 active:scale-95"
            style={{
              background: isActive ? 'var(--accent)' : 'var(--surface)',
              color: isActive ? 'var(--on-accent)' : 'var(--text-muted)',
              border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
            }}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
