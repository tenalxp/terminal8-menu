import { useRef, useState } from 'react'
import { Camera, Trash } from '@phosphor-icons/react'
import { supabase } from '../lib/supabase'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml']
const MAX_IMAGE_BYTES = 2 * 1024 * 1024

async function uploadLogo(file) {
  const ext = file.name.split('.').pop()
  const path = `logo-${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('menu-photos').upload(path, file, { cacheControl: '3600' })
  if (error) throw error
  const { data } = supabase.storage.from('menu-photos').getPublicUrl(path)
  return data.publicUrl
}

export default function AdminBranding({ logoUrl, onChange }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  async function persist(url) {
    setSaving(true)
    setError('')
    try {
      const { data, error: err } = await supabase
        .from('app_settings')
        .update({ logo_url: url })
        .eq('id', 1)
        .select()
      if (err) throw err
      if (!data || data.length === 0) {
        throw new Error('Save did not apply (no matching row) - check the app_settings RLS policy')
      }
      onChange(url)
    } catch (err) {
      setError(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function handlePick(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('Logo must be a JPEG, PNG, or SVG file')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('Logo must be smaller than 2MB')
      return
    }
    setError('')
    try {
      const url = await uploadLogo(file)
      await persist(url)
    } catch (err) {
      setError(err.message || 'Failed to upload')
    }
  }

  return (
    <section
      className="flex items-center gap-3 rounded-2xl p-3"
      style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-sm)' }}
    >
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/svg+xml" onChange={handlePick} className="hidden" />

      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl"
        style={{ background: 'var(--surface-2)' }}
      >
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-full w-full object-contain p-1" />
        ) : (
          <Camera size={20} weight="light" style={{ color: 'var(--text-muted)' }} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
          Site logo
        </p>
        <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
          Shown centered at the top of the customer menu page
        </p>
        {error && (
          <p className="text-[12px] mt-0.5" style={{ color: 'var(--danger)' }}>
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5 shrink-0">
        <button
          type="button"
          disabled={saving}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-full px-3 py-1.5 text-[12px] font-semibold transition active:scale-[0.98] disabled:opacity-60"
          style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
        >
          {logoUrl ? 'Change' : 'Upload'}
        </button>
        {logoUrl && (
          <button
            type="button"
            disabled={saving}
            onClick={() => persist(null)}
            className="flex items-center justify-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-medium transition active:scale-[0.98] disabled:opacity-60"
            style={{ border: '1px solid var(--border)', color: 'var(--danger)' }}
          >
            <Trash size={12} weight="bold" />
            Remove
          </button>
        )}
      </div>
    </section>
  )
}
