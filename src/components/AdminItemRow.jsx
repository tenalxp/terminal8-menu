import { ForkKnife, PencilSimple, Trash } from '@phosphor-icons/react'
import { formatPrice } from '../lib/format'

export default function AdminItemRow({ item, onEdit, onDelete }) {
  return (
    <div
      className="flex gap-3 rounded-2xl p-3"
      style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-sm)' }}
    >
      <div
        className="shrink-0 w-16 h-16 rounded-xl overflow-hidden"
        style={{ background: 'var(--surface-2)' }}
      >
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ForkKnife size={18} weight="light" style={{ color: 'var(--text-muted)' }} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
        <h3 className="text-[14px] font-semibold leading-snug truncate" style={{ color: 'var(--text)' }}>
          {item.name}
        </h3>
        <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
          {item.category}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[13px] font-semibold" style={{ color: 'var(--accent)' }}>
            {formatPrice(item.price)}
          </span>
          {!item.available && (
            <span
              className="text-[11px] font-medium px-2 py-0.5 rounded-full"
              style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}
            >
              Sold out
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(item)}
          aria-label="Edit"
          className="flex h-8 w-8 items-center justify-center rounded-full transition active:scale-95"
          style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
        >
          <PencilSimple size={14} weight="bold" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(item)}
          aria-label="Delete"
          className="flex h-8 w-8 items-center justify-center rounded-full transition active:scale-95"
          style={{ border: '1px solid var(--border)', color: 'var(--danger)' }}
        >
          <Trash size={14} weight="bold" />
        </button>
      </div>
    </div>
  )
}
