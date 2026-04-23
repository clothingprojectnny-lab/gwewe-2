'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { upload } from '@vercel/blob/client'
import type { Product } from '@/lib/db'

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

type UploadingImage = { id: string; preview: string; status: 'uploading' | 'done' | 'error'; progress: number }

export default function ProductForm({ product, isNew }: { product?: Product; isNew?: boolean }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploads, setUploads] = useState<UploadingImage[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<Partial<Product>>({
    name: product?.name || '',
    price: product?.price || 0,
    description: product?.description || '',
    materials: product?.materials || '',
    care: product?.care || '',
    sizeChart: product?.sizeChart || '',
    images: product?.images || [],
    sizes: product?.sizes || DEFAULT_SIZES,
    stock: product?.stock || DEFAULT_SIZES.reduce((acc, s) => ({ ...acc, [s]: 0 }), {}),
    active: product?.active ?? true,
  })

  async function uploadFile(file: File) {
    const id = Math.random().toString(36).slice(2)
    const preview = URL.createObjectURL(file)
    setUploads(prev => [...prev, { id, preview, status: 'uploading', progress: 0 }])

    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const blob = await upload(filename, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/upload',
        onUploadProgress: (p) => {
          setUploads(prev => prev.map(u => u.id === id ? { ...u, progress: p.percentage } : u))
        },
      })
      setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'done', progress: 100 } : u))
      setForm(f => ({ ...f, images: [...(f.images || []), blob.url] }))
      setTimeout(() => { setUploads(prev => prev.filter(u => u.id !== id)); URL.revokeObjectURL(preview) }, 600)
    } catch { setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'error' } : u)) }
  }

  function handleFiles(files: FileList | null) {
    if (!files) return
    Array.from(files).forEach(f => { if (f.type.startsWith('image/')) uploadFile(f) })
  }

  function handleDrag(e: React.DragEvent) { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === 'dragenter' || e.type === 'dragover') }
  function handleDrop(e: React.DragEvent) { e.preventDefault(); e.stopPropagation(); setDragActive(false); handleFiles(e.dataTransfer.files) }
  function removeImage(i: number) { setForm(f => ({ ...f, images: f.images?.filter((_, idx) => idx !== i) || [] })) }
  function updateStock(size: string, v: number) { setForm(f => ({ ...f, stock: { ...f.stock, [size]: v } })) }

  async function handleSave() {
    setSaving(true)
    const method = isNew ? 'POST' : 'PUT'
    const url = isNew ? '/api/admin/products' : `/api/admin/products/${product!.id}`
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { router.push('/admin/products'); router.refresh() } else { setSaving(false); alert('Save failed') }
  }

  async function handleDelete() {
    if (!confirm('Delete permanently?')) return
    const res = await fetch(`/api/admin/products/${product!.id}`, { method: 'DELETE' })
    if (res.ok) { router.push('/admin/products'); router.refresh() }
  }

  return (
    <div className="dmv-card">
      <div className="dmv-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{isNew ? 'Add Product' : 'Edit Product'}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          {!isNew && <button onClick={handleDelete} className="dmv-button" style={{ color: 'var(--dmv-red)' }}>Delete</button>}
          <button onClick={handleSave} disabled={saving || !form.name || uploads.some(u => u.status === 'uploading')} className="dmv-button dmv-button-primary">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
      <div className="dmv-card-body">
        {/* Images */}
        <div className="dmv-field">
          <label className="dmv-label">Product Images</label>
          <div
            onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
            style={{ border: dragActive ? '2px dashed var(--dmv-blue)' : '2px dashed var(--dmv-border)', background: dragActive ? '#eef4fb' : 'var(--dmv-grey-light)', padding: 12, position: 'relative' }}
          >
            <input ref={inputRef} type="file" multiple accept="image/*" onChange={e => handleFiles(e.target.files)} style={{ display: 'none' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {form.images?.map((url, i) => (
                <div key={`s-${i}`} style={{ position: 'relative', aspectRatio: '3/4', background: '#f0f0f0', border: '1px solid var(--dmv-border)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, border: '1px solid #999', background: 'white', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  {i === 0 && <div style={{ position: 'absolute', bottom: 2, left: 2, fontSize: 8, background: 'var(--dmv-blue-dark)', color: 'white', padding: '1px 5px', letterSpacing: 1 }}>PRIMARY</div>}
                </div>
              ))}
              {uploads.map(u => (
                <div key={u.id} style={{ position: 'relative', aspectRatio: '3/4', background: '#f0f0f0', border: '1px solid var(--dmv-border)', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
                  {u.status === 'uploading' && (
                    <><div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: 'var(--dmv-blue)' }}>{Math.round(u.progress)}%</div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'var(--dmv-border)' }}><div style={{ height: '100%', background: 'var(--dmv-blue)', width: `${u.progress}%`, transition: 'width 0.2s' }} /></div></>
                  )}
                  {u.status === 'error' && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--dmv-red)', fontWeight: 600 }}>FAILED</div>}
                  {u.status === 'done' && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--dmv-success)' }}>✓</div>}
                </div>
              ))}
              <button type="button" onClick={() => inputRef.current?.click()} style={{ aspectRatio: '3/4', background: 'var(--dmv-card)', border: '1px dashed #999', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <span style={{ fontSize: 20, color: 'var(--dmv-grey-dark)' }}>+</span>
                <span style={{ fontSize: 9, color: 'var(--dmv-grey-dark)', letterSpacing: 1 }}>ADD</span>
              </button>
            </div>
            <p style={{ fontSize: 9, color: 'var(--dmv-grey-dark)', marginTop: 8, letterSpacing: 0.5 }}>First image is primary. Drag to upload. Max 10MB.</p>
          </div>
        </div>

        <div className="dmv-row">
          <div className="dmv-field"><label className="dmv-label dmv-required">Product Name</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="dmv-input" /></div>
          <div className="dmv-field"><label className="dmv-label">Price ($)</label><input type="number" step="0.01" value={form.price ? (form.price / 100).toFixed(2) : ''} onChange={e => setForm(f => ({ ...f, price: Math.round(parseFloat(e.target.value || '0') * 100) }))} className="dmv-input" /></div>
        </div>

        <div className="dmv-field"><label className="dmv-label">Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className="dmv-input" style={{ resize: 'vertical' }} /></div>

        <div className="dmv-row">
          <div className="dmv-field"><label className="dmv-label">Materials</label><textarea value={form.materials} onChange={e => setForm(f => ({ ...f, materials: e.target.value }))} rows={3} className="dmv-input" style={{ resize: 'vertical' }} /></div>
          <div className="dmv-field"><label className="dmv-label">Care Instructions</label><textarea value={form.care} onChange={e => setForm(f => ({ ...f, care: e.target.value }))} rows={3} className="dmv-input" style={{ resize: 'vertical' }} /></div>
        </div>

        <div className="dmv-field"><label className="dmv-label">Size Chart</label><textarea value={form.sizeChart} onChange={e => setForm(f => ({ ...f, sizeChart: e.target.value }))} rows={3} placeholder="e.g. S: chest 96cm, length 68cm..." className="dmv-input" style={{ resize: 'vertical' }} /></div>

        <div className="dmv-field">
          <label className="dmv-label">Stock by Size</label>
          <table className="dmv-table">
            <thead><tr>{(form.sizes || DEFAULT_SIZES).map(s => <th key={s} style={{ textAlign: 'center' }}>{s}</th>)}</tr></thead>
            <tbody><tr>{(form.sizes || DEFAULT_SIZES).map(s => <td key={s} style={{ padding: 4 }}><input type="number" min="0" value={form.stock?.[s] ?? 0} onChange={e => updateStock(s, parseInt(e.target.value || '0'))} className="dmv-input" style={{ textAlign: 'center' }} /></td>)}</tr></tbody>
          </table>
        </div>

        <div style={{ background: 'var(--dmv-grey-light)', padding: 12, border: '1px solid var(--dmv-border)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.active ?? true} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
            <span style={{ fontSize: 11, fontWeight: 500 }}>Visible on Public Catalogue</span>
          </label>
        </div>
      </div>
    </div>
  )
}
