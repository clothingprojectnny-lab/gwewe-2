'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Order } from '@/lib/db'

const STATUSES: Array<Order['status']> = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

export default function OrderDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [saving, setSaving] = useState(false)
  const [tracking, setTracking] = useState('')

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`).then(r => r.json()).then(data => {
      setOrder(data)
      setTracking(data?.trackingNumber || '')
    })
  }, [id])

  async function updateStatus(status: Order['status']) {
    if (!order) return
    setSaving(true)
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, trackingNumber: tracking }),
    })
    const res = await fetch(`/api/admin/orders/${id}`)
    setOrder(await res.json())
    setSaving(false)
  }

  async function saveTracking() {
    if (!order) return
    setSaving(true)
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackingNumber: tracking }),
    })
    setSaving(false)
  }

  if (!order) return <div className="dmv-card"><div className="dmv-card-body"><p>Loading...</p></div></div>

  return (
    <>
      <div className="dmv-breadcrumb">
        <Link href="/admin/orders">Orders</Link>
        <span>›</span>
        <span style={{ color: 'var(--dmv-grey-dark)' }}>{order.id}</span>
      </div>

      <div className="dmv-card">
        <div className="dmv-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Order {order.id}</h2>
          <span className={`dmv-status dmv-status-${order.status}`}>{order.status}</span>
        </div>
        <div className="dmv-card-body">
          <div className="dmv-row">
            <div>
              <div className="dmv-label" style={{ marginBottom: 8 }}>Items</div>
              <table className="dmv-table">
                <thead><tr><th>Item</th><th style={{ width: 50 }}>Size</th><th style={{ width: 80, textAlign: 'right' }}>Value</th></tr></thead>
                <tbody>
                  {order.cart.map((item, i) => (
                    <tr key={i}><td>{item.productName || item.productId}</td><td>{item.size}</td><td style={{ textAlign: 'right' }}>${(item.price / 100).toFixed(2)}</td></tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--dmv-grey-light)', border: '1px solid var(--dmv-border)', borderTop: 'none', fontWeight: 600 }}>
                <span>Total</span><span>${(order.total / 100).toFixed(2)}</span>
              </div>
            </div>

            <div>
              <div className="dmv-label" style={{ marginBottom: 8 }}>Dispatch Address</div>
              <table className="dmv-table">
                <tbody>
                  <tr><td style={{ fontWeight: 600, width: 90, background: 'var(--dmv-grey-light)' }}>Name</td><td>{order.shipping.name}</td></tr>
                  <tr><td style={{ fontWeight: 600, background: 'var(--dmv-grey-light)' }}>Email</td><td>{order.shipping.email}</td></tr>
                  <tr><td style={{ fontWeight: 600, background: 'var(--dmv-grey-light)' }}>Address</td><td>{order.shipping.address}</td></tr>
                  <tr><td style={{ fontWeight: 600, background: 'var(--dmv-grey-light)' }}>City</td><td>{order.shipping.city}</td></tr>
                  <tr><td style={{ fontWeight: 600, background: 'var(--dmv-grey-light)' }}>Postcode</td><td>{order.shipping.postcode}</td></tr>
                  <tr><td style={{ fontWeight: 600, background: 'var(--dmv-grey-light)' }}>Country</td><td>{order.shipping.country}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="dmv-divider" />

          <div className="dmv-field">
            <label className="dmv-label">Tracking Reference</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={tracking} onChange={e => setTracking(e.target.value)} placeholder="Enter tracking number" className="dmv-input" style={{ flex: 1 }} />
              <button onClick={saveTracking} disabled={saving} className="dmv-button">Save</button>
            </div>
          </div>

          <div className="dmv-field">
            <label className="dmv-label">Update Status</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {STATUSES.map(status => (
                <button key={status} onClick={() => updateStatus(status)} disabled={saving || order.status === status}
                  className={order.status === status ? 'dmv-button dmv-button-primary' : 'dmv-button'}
                  style={{ textTransform: 'capitalize' }}>
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
