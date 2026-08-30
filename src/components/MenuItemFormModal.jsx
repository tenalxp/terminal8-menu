import { useEffect, useRef, useState } from 'react'
import { X, Camera, Trash } from '@phosphor-icons/react'
import { supabase } from '../lib/supabase'
import ModalShell from './ModalShell'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png']
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

const emptyForm = { name: '', description: '', price: '', category: '', sortOrder: '0', available: true }

async function uploadItemImage(file) {
  const ext = file.name.split('.').pop()
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('menu-photos').upload(path, file, {
    cacheControl: '3600',
  })
  if (error) throw error
  const { data } = supabase.storage.from('menu-photos').getPublicUrl(path)
  return data.publicUrl
}

export default function MenuItemFormModal({ open, item, categorySuggestions, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm)
  const [imageUrl, setImageUrl] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [pendingFile, setPendingFile] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!open) return
    if (item) {
      setForm({
        name: item.name,
        description: item.description ?? '',
        price: String(item.price),
        category: item.category,
        sortOrder: String(item.sort_order ?? 0),
        available: item.available,
      })
      setImageUrl(item.image_url ?? null)
      setImagePreview(item.image_url ?? null)
    } else {
      setForm(emptyForm)
      setImageUrl(null)
      setImagePreview(null)
    }
    setPendingFile(null)
    setError('')
  }, [open, item])

  const isEdit = Boolean(item)

  function handlePickImage(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('Photo must be a JPEG or PNG file')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('Photo must be smaller than 5MB')
      return
    }
    setError('')
    setPendingFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function handleRemoveImage() {
    setPendingFile(null)
    setImagePreview(null)
    setImageUrl(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Please enter a dish name')
      return
    }
    const price = Number(form.price)
    if (Number.isNaN(price) || price < 0) {
      setError('Price must be a non-negative number')
      return
    }
    const sortOrder = Number(form.sortOrder || 0)
    if (Number.isNaN(sortOrder)) {
      setError('Sort order must be a number')
      return
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price,
      category: form.category.trim() || 'Other',
      sort_order: sortOrder,
      available: form.available,
    }

    setSaving(true)
    try {
      payload.image_url = pendingFile ? await uploadItemImage(pendingFile) : imageUrl
      await onSave(payload, item?.id)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ModalShell open={open} onDismiss={onClose}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>
          {isEdit ? 'Edit Dish' : 'Add New Dish'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-7 w-7 items-center justify-center rounded-full"
          style={{ color: 'var(--text-muted)' }}
        >
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handlePickImage}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl transition"
            style={{
              border: '1px dashed var(--border-strong)',
              background: 'var(--surface-2)',
              color: 'var(--text-muted)',
            }}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex flex-col items-center gap-1">
                <Camera size={22} />
                <span className="text-[11px]">Add photo</span>
              </span>
            )}
          </button>
          {imagePreview && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="flex items-center gap-1 text-xs transition"
              style={{ color: 'var(--text-muted)' }}
            >
              <Trash size={12} />
              Remove photo
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium" style={{ color: 'var(--text)' }}>
            Dish Name
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Pad Thai"
            className="rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium" style={{ color: 'var(--text)' }}>
            Description
          </label>
          <textarea
            id="description"
            rows={2}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Rice noodles, shrimp, egg, tamarind sauce..."
            className="resize-none rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="price" className="text-sm font-medium" style={{ color: 'var(--text)' }}>
              Price (฿)
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              placeholder="89"
              className="rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-sm font-medium" style={{ color: 'var(--text)' }}>
              Category
            </label>
            <input
              id="category"
              list="category-list"
              type="text"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              placeholder="Noodles"
              className="rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
            />
            <datalist id="category-list">
              {categorySuggestions.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sortOrder" className="text-sm font-medium" style={{ color: 'var(--text)' }}>
              Sort order
            </label>
            <input
              id="sortOrder"
              type="number"
              step="1"
              value={form.sortOrder}
              onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
              placeholder="0"
              className="w-24 rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
            />
          </div>

          <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text)' }}>
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
              style={{ accentColor: 'var(--accent)' }}
              className="h-4 w-4 rounded"
            />
            Available
          </label>
        </div>

        {error && (
          <p className="text-sm" style={{ color: 'var(--danger)' }}>
            {error}
          </p>
        )}

        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium transition active:scale-[0.98]"
            style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full px-4 py-2 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-60"
            style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </ModalShell>
  )
}
