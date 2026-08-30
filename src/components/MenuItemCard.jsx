import { ForkKnife } from '@phosphor-icons/react'
import { formatPrice } from '../lib/format'

export default function MenuItemCard({ item, index }) {
  const soldOut = !item.available

  return (
    <div
      className="card-enter rounded-2xl overflow-hidden"
      style={{
        background: 'var(--surface)',
        boxShadow: 'var(--shadow-sm)',
        '--end-opacity': 1,
        '--enter-delay': `${Math.min(index, 8) * 0.03}s`,
      }}
    >
      <div className="relative aspect-square" style={{ background: 'var(--surface-2)' }}>
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover"
            style={{ filter: soldOut ? 'grayscale(1)' : 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ForkKnife size={28} weight="light" style={{ color: 'var(--text-muted)' }} />
          </div>
        )}

        <span
          className="absolute top-2 right-2 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur"
          style={{
            background: soldOut ? 'var(--danger-soft)' : 'color-mix(in srgb, var(--surface) 88%, transparent)',
            color: soldOut ? 'var(--danger)' : 'var(--accent)',
          }}
        >
          {soldOut ? 'Sold out' : formatPrice(item.price)}
        </span>
      </div>

      <div className="p-2.5 flex flex-col gap-0.5" style={{ opacity: soldOut ? 0.6 : 1 }}>
        <h3 className="text-[13px] font-semibold leading-snug truncate" style={{ color: 'var(--text)' }}>
          {item.name}
        </h3>
        {item.description && (
          <p className="text-[11px] leading-snug line-clamp-2" style={{ color: 'var(--text-muted)' }}>
            {item.description}
          </p>
        )}
      </div>
    </div>
  )
}
