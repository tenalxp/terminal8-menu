import { useEffect, useMemo, useState } from 'react'
import { WarningCircle } from '@phosphor-icons/react'
import { supabase } from './lib/supabase'
import { fetchLogoUrl } from './lib/appSettings'
import AuthScreen from './components/AuthScreen'
import AdminHeader from './components/AdminHeader'
import AdminBranding from './components/AdminBranding'
import AdminItemRow from './components/AdminItemRow'
import MenuItemFormModal from './components/MenuItemFormModal'
import ConfirmDialog from './components/ConfirmDialog'
import SearchBar from './components/SearchBar'
import EmptyState from './components/EmptyState'
import MenuSkeleton from './components/MenuSkeleton'

function useSession() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase?.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase?.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    }) ?? { data: null }
    return () => sub?.subscription.unsubscribe()
  }, [])

  return session
}

export default function AdminApp() {
  const session = useSession()

  if (!supabase) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6 text-center" style={{ background: 'var(--bg)' }}>
        <div className="flex flex-col items-center gap-3">
          <WarningCircle size={28} style={{ color: 'var(--danger)' }} />
          <p style={{ color: 'var(--text)' }}>Supabase isn't configured. Check the .env file.</p>
        </div>
      </div>
    )
  }

  if (session === undefined) {
    return (
      <div className="flex min-h-dvh items-center justify-center" style={{ background: 'var(--bg)' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    )
  }

  if (!session) {
    return <AuthScreen />
  }

  return <AdminDashboard userEmail={session.user.email} />
}

function AdminDashboard({ userEmail }) {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [search, setSearch] = useState('')
  const [itemModal, setItemModal] = useState({ open: false, item: null })
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [logoUrl, setLogoUrl] = useState(null)

  useEffect(() => {
    fetchLogoUrl().then(setLogoUrl)
  }, [])

  async function loadItems() {
    setStatus('loading')
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
    if (error) {
      setStatus('error')
      return
    }
    setItems(data ?? [])
    setStatus('ready')
  }

  useEffect(() => {
    loadItems()
  }, [])

  const categorySuggestions = useMemo(() => {
    const seen = new Set()
    for (const item of items) seen.add(item.category)
    return [...seen].sort()
  }, [items])

  const grouped = useMemo(() => {
    const query = search.trim().toLowerCase()
    const map = new Map()
    for (const item of items) {
      if (query && !`${item.name} ${item.description ?? ''}`.toLowerCase().includes(query)) continue
      if (!map.has(item.category)) map.set(item.category, [])
      map.get(item.category).push(item)
    }
    return map
  }, [items, search])

  async function handleSaveItem(payload, id) {
    if (id) {
      const { error } = await supabase.from('menu_items').update(payload).eq('id', id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('menu_items').insert(payload)
      if (error) throw error
    }
    await loadItems()
  }

  async function handleDeleteConfirmed() {
    const target = deleteTarget
    setDeleteTarget(null)
    const { error } = await supabase.from('menu_items').delete().eq('id', target.id)
    if (!error) await loadItems()
  }

  return (
    <div className="min-h-dvh pb-10" style={{ background: 'var(--bg)' }}>
      <AdminHeader
        userEmail={userEmail}
        onAddItem={() => setItemModal({ open: true, item: null })}
        onLogout={() => supabase.auth.signOut()}
      />

      <div className="px-4 pt-3 flex flex-col gap-3">
        <AdminBranding logoUrl={logoUrl} onChange={setLogoUrl} />
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <main className="mt-3 px-4 flex flex-col gap-6">
        {status === 'loading' && <MenuSkeleton />}

        {status === 'error' && (
          <EmptyState message="Couldn't load the menu" hint="Check your connection and try refreshing." />
        )}

        {status === 'ready' && items.length === 0 && (
          <EmptyState message="No dishes yet" hint='Tap "Add item" to create the first one.' />
        )}

        {status === 'ready' &&
          items.length > 0 &&
          [...grouped.entries()].map(([category, categoryItems]) => (
            <section key={category} className="flex flex-col gap-3">
              <h2 className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>
                {category}
              </h2>
              {categoryItems.map((item) => (
                <AdminItemRow
                  key={item.id}
                  item={item}
                  onEdit={(it) => setItemModal({ open: true, item: it })}
                  onDelete={(it) => setDeleteTarget(it)}
                />
              ))}
            </section>
          ))}

        {status === 'ready' && items.length > 0 && grouped.size === 0 && (
          <EmptyState message="No dishes found" hint="Try a different search." />
        )}
      </main>

      <MenuItemFormModal
        open={itemModal.open}
        item={itemModal.item}
        categorySuggestions={categorySuggestions}
        onClose={() => setItemModal({ open: false, item: null })}
        onSave={handleSaveItem}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this dish?"
        message={deleteTarget ? `"${deleteTarget.name}" will be permanently removed from the menu.` : ''}
        confirmLabel="Delete"
        danger
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
