'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type CartItem = {
  productId: string
  productName?: string
  size: string
  price: number
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', postcode: '', country: 'US' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem('gwewe_cart') || '[]')
    setCart(stored)
  }, [])

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart, shipping: form, total }),
    })

    if (res.ok) {
      const { invoiceUrl } = await res.json()
      sessionStorage.removeItem('gwewe_cart')
      window.location.href = invoiceUrl
    } else {
      setLoading(false)
    }
  }

  return (
    <>
      <nav className="portal-nav">
        <div className="portal-nav-inner">
          <Link href="/shop">Catalogue</Link>
          <Link href="#">Records</Link>
          <Link href="#">Access Log</Link>
          <Link href="#">Member File</Link>
          <Link href="#">Contact</Link>
          <Link href="/enter">Exit Portal</Link>
        </div>
      </nav>

      <div className="portal-container">
        <div className="portal-breadcrumb">
          <Link href="/shop">Catalogue</Link>
          <span>›</span>
          <span style={{ color: 'var(--portal-text-muted)' }}>Fulfilment Details</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }} className="portal-grid-2">
          <div className="portal-card">
            <div className="portal-card-header">
              <h2>Fulfilment Details</h2>
            </div>
            <div className="portal-card-body">
              <div className="portal-notice">
                <strong>Required:</strong> Complete all fields marked ✱ to process this order.
              </div>

              <form onSubmit={handleSubmit}>
                <div className="portal-field">
                  <label className="portal-label portal-label-required">Recipient Name</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="portal-input" />
                </div>

                <div className="portal-field">
                  <label className="portal-label portal-label-required">Email Address</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="portal-input" />
                </div>

                <div className="portal-field">
                  <label className="portal-label portal-label-required">Dispatch Address</label>
                  <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required className="portal-input" />
                </div>

                <div className="portal-grid-2">
                  <div className="portal-field">
                    <label className="portal-label portal-label-required">City</label>
                    <input type="text" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required className="portal-input" />
                  </div>
                  <div className="portal-field">
                    <label className="portal-label portal-label-required">ZIP / Postcode</label>
                    <input type="text" value={form.postcode} onChange={e => setForm(f => ({ ...f, postcode: e.target.value }))} required className="portal-input" />
                  </div>
                </div>

                <div className="portal-field">
                  <label className="portal-label">Country</label>
                  <input type="text" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className="portal-input" />
                </div>

                <div className="portal-notice portal-notice-info">
                  <strong>Payment Method:</strong> Payment is accepted through the approved network
                  listed at checkout. Order processing begins after confirmation.
                </div>

                <button
                  type="submit"
                  disabled={loading || cart.length === 0}
                  className="portal-btn portal-btn-primary"
                  style={{ width: '100%', padding: '10px', fontSize: 11 }}
                >
                  {loading ? 'Processing...' : 'Submit Order & Pay →'}
                </button>
              </form>
            </div>
          </div>

          {/* Order summary */}
          <div className="portal-card">
            <div className="portal-card-header">
              <h2>Order Summary</h2>
            </div>
            <div className="portal-card-body">
              {cart.length === 0 ? (
                <p style={{ fontSize: 11, color: 'var(--portal-text-faint)' }}>No items pending.</p>
              ) : (
                <>
                  <table className="portal-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th style={{ width: 50 }}>Size</th>
                        <th style={{ width: 80, textAlign: 'right' }}>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item, i) => (
                        <tr key={i}>
                          <td>{item.productName || item.productId}</td>
                          <td>{item.size}</td>
                          <td style={{ textAlign: 'right' }}>${(item.price / 100).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: 'var(--portal-bg)',
                    border: '1px solid var(--portal-border)',
                    borderTop: 'none',
                    fontWeight: 600,
                    fontSize: 12,
                  }}>
                    <span>Total Declared Value</span>
                    <span>${(total / 100).toFixed(2)}</span>
                  </div>

                  <div className="portal-notice" style={{ marginTop: 14, fontSize: 10 }}>
                    Dispatch details will be issued by email following payment verification.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
