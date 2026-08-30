import { ForkKnife } from '@phosphor-icons/react'
import { formatPrice } from '../lib/format'

export default function MenuItemCard({ item, index }) {
  const soldOut = !item.available

  return (
    <div
      className="card-enter flex gap-3 rounded-2xl p-3"
      style={{
        background: 'var(--surface)',
        boxShadow: 'var(--shadow-sm)',
        '--end-opacity': soldOut ? 0.6 : 1,
        '--enter-delay': `${Math.min(index, 6) * 0.04}s`,
      }}
    >
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <h3 className="text-[15px] font-semibold leading-snug truncate" style={{ color: 'var(--text)' }}>
          {item.name}
        </h3>
        {item.description && (
          <p className="text-[13px] leading-snug line-clamp-2" style={{ color: 'var(--text-muted)' }}>
            {item.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[14px] font-semibold" style={{ color: 'var(--accent)' }}>
            {formatPrice(item.price)}
          </span>
          {soldOut && (
            <span
              className="text-[11px] font-medium px-2 py-0.5 rounded-full"
              style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}
            >
              Sold out
            </span>
          )}
        </div>
      </div>

      <div
        className="shrink-0 w-20 h-20 rounded-xl overflow-hidden"
        style={{ background: 'var(--surface-2)', filter: soldOut ? 'grayscale(1)' : 'none' }}
      >
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ForkKnife size={22} weight="light" style={{ color: 'var(--text-muted)' }} />
          </div>
        )}
      </div>
    </div>
  )
}
