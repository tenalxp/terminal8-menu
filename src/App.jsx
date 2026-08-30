import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowClockwise, WarningCircle } from '@phosphor-icons/react'
import { supabase } from './lib/supabase'
import SearchBar from './components/SearchBar'
import CategoryTabs from './components/CategoryTabs'
import MenuItemCard from './components/MenuItemCard'
import MenuSkeleton from './components/MenuSkeleton'
import EmptyState from './components/EmptyState'

const STICKY_OFFSET = 132

function useMenuItems() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    if (!supabase) {
      setStatus('error')
      return
    }

    supabase
      .from('menu_items')
      .select('*')
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          setStatus('error')
          return
        }
        setItems(data ?? [])
        setStatus('ready')
      })

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  return { items, status, retry: () => setReloadKey((k) => k + 1) }
}

export default function App() {
  const { items, status, retry } = useMenuItems()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const sectionRefs = useRef({})
  const isClickScrolling = useRef(false)

  const categories = useMemo(() => {
    const seen = new Set()
    const order = []
    for (const item of items) {
      if (!seen.has(item.category)) {
        seen.add(item.category)
        order.push(item.category)
      }
    }
    return order
  }, [items])

  const filteredByCategory = useMemo(() => {
    const query = search.trim().toLowerCase()
    const groups = new Map()
    for (const category of categories) groups.set(category, [])
    for (const item of items) {
      if (query) {
        const haystack = `${item.name} ${item.description ?? ''}`.toLowerCase()
        if (!haystack.includes(query)) continue
      }
      groups.get(item.category)?.push(item)
    }
    return groups
  }, [items, categories, search])

  const visibleCategories = useMemo(
    () => categories.filter((c) => (filteredByCategory.get(c)?.length ?? 0) > 0),
    [categories, filteredByCategory],
  )

  useEffect(() => {
    if (!activeCategory && visibleCategories.length > 0) {
      setActiveCategory(visibleCategories[0])
    }
  }, [visibleCategories, activeCategory])

  useEffect(() => {
    if (visibleCategories.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) {
          setActiveCategory(visible[0].target.dataset.category)
        }
      },
      { rootMargin: `-${STICKY_OFFSET}px 0px -60% 0px`, threshold: 0 },
    )

    for (const category of visibleCategories) {
      const el = sectionRefs.current[category]
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [visibleCategories])

  function handleSelectCategory(category) {
    setActiveCategory(category)
    const el = sectionRefs.current[category]
    if (!el) return
    isClickScrolling.current = true
    const top = el.getBoundingClientRect().top + window.scrollY - STICKY_OFFSET + 1
    window.scrollTo({ top, behavior: 'smooth' })
    window.clearTimeout(handleSelectCategory._t)
    handleSelectCategory._t = window.setTimeout(() => {
      isClickScrolling.current = false
    }, 600)
  }

  const totalVisible = [...filteredByCategory.values()].reduce((sum, list) => sum + list.length, 0)

  return (
    <div className="min-h-dvh pb-10" style={{ background: 'var(--bg)' }}>
      <header className="px-4 pt-8 pb-4">
        <p className="text-[12px] font-semibold tracking-[0.14em] uppercase" style={{ color: 'var(--text-muted)' }}>
          Terminal 8
        </p>
        <h1 className="text-[26px] font-bold leading-tight mt-1" style={{ color: 'var(--text)' }}>
          Menu
        </h1>
      </header>

      <div
        className="sticky top-0 z-20 px-4 pb-2 pt-2 backdrop-blur"
        style={{ background: 'color-mix(in srgb, var(--bg) 92%, transparent)' }}
      >
        <SearchBar value={search} onChange={setSearch} />
        {status === 'ready' && visibleCategories.length > 0 && (
          <CategoryTabs categories={visibleCategories} active={activeCategory} onSelect={handleSelectCategory} />
        )}
      </div>

      <main className="mt-2">
        {status === 'loading' && <MenuSkeleton />}

        {status === 'error' && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center px-6">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'var(--danger-soft)' }}
            >
              <WarningCircle size={22} weight="light" style={{ color: 'var(--danger)' }} />
            </div>
            <p className="text-[15px] font-medium" style={{ color: 'var(--text)' }}>
              Couldn't load the menu
            </p>
            <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
              Please ask a staff member, or try again.
            </p>
            <button
              type="button"
              onClick={retry}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium mt-1 active:scale-95 transition-transform"
              style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
            >
              <ArrowClockwise size={16} weight="bold" />
              Try again
            </button>
          </div>
        )}

        {status === 'ready' && items.length === 0 && (
          <EmptyState message="The menu is empty" hint="Please check back soon." />
        )}

        {status === 'ready' && items.length > 0 && totalVisible === 0 && (
          <EmptyState message="No dishes found" hint="Try a different search." />
        )}

        {status === 'ready' &&
          visibleCategories.map((category) => (
            <section
              key={category}
              data-category={category}
              ref={(el) => {
                sectionRefs.current[category] = el
              }}
              className="px-4 pt-4 flex flex-col gap-3"
            >
              <h2 className="text-[17px] font-bold" style={{ color: 'var(--text)' }}>
                {category}
              </h2>
              {filteredByCategory.get(category).map((item, index) => (
                <MenuItemCard key={item.id} item={item} index={index} />
              ))}
            </section>
          ))}
      </main>
    </div>
  )
}
