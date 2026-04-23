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
      <nav className="dmv-nav">
        <div className="dmv-nav-inner">
          <Link href="/shop">Catalogue</Link>
          <Link href="#">Records</Link>
          <Link href="#">Access Log</Link>
          <Link href="#">Member File</Link>
          <Link href="#">Contact</Link>
          <Link href="/enter">Exit Portal</Link>
        </div>
      </nav>

      <div className="dmv-container">
        <div className="dmv-breadcrumb">
          <Link href="/shop">Catalogue</Link>
          <span>›</span>
          <span style={{ color: 'var(--dmv-grey-dark)' }}>Fulfilment Details</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }} className="dmv-row">
          <div className="dmv-card">
            <div className="dmv-card-header">
              <h2>Fulfilment Details</h2>
            </div>
            <div className="dmv-card-body">
              <div className="dmv-notice">
                <strong>Required:</strong> Complete all fields marked ✱ to process this order.
              </div>

              <form onSubmit={handleSubmit}>
                <div className="dmv-field">
                  <label className="dmv-label dmv-required">Recipient Name</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="dmv-input" />
                </div>

                <div className="dmv-field">
                  <label className="dmv-label dmv-required">Email Address</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="dmv-input" />
                </div>

                <div className="dmv-field">
                  <label className="dmv-label dmv-required">Dispatch Address</label>
                  <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required className="dmv-input" />
                </div>

                <div className="dmv-row">
                  <div className="dmv-field">
                    <label className="dmv-label dmv-required">City</label>
                    <input type="text" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required className="dmv-input" />
                  </div>
                  <div className="dmv-field">
                    <label className="dmv-label dmv-required">ZIP / Postcode</label>
                    <input type="text" value={form.postcode} onChange={e => setForm(f => ({ ...f, postcode: e.target.value }))} required className="dmv-input" />
                  </div>
                </div>

                <div className="dmv-field">
                  <label className="dmv-label">Country</label>
                  <input type="text" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className="dmv-input" />
                </div>

                <div className="dmv-notice dmv-notice-info">
                  <strong>Payment Method:</strong> Payment is accepted through the approved network
                  listed at checkout. Order processing begins after confirmation.
                </div>

                <button
                  type="submit"
                  disabled={loading || cart.length === 0}
                  className="dmv-button dmv-button-primary"
                  style={{ width: '100%', padding: '10px', fontSize: 11 }}
                >
                  {loading ? 'Processing...' : 'Submit Order & Pay →'}
                </button>
              </form>
            </div>
          </div>

          {/* Order summary */}
          <div className="dmv-card">
            <div className="dmv-card-header">
              <h2>Order Summary</h2>
            </div>
            <div className="dmv-card-body">
              {cart.length === 0 ? (
                <p style={{ fontSize: 11, color: 'var(--dmv-grey-dark)' }}>No items pending.</p>
              ) : (
                <>
                  <table className="dmv-table">
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
                    background: 'var(--dmv-grey-light)',
                    border: '1px solid var(--dmv-border)',
                    borderTop: 'none',
                    fontWeight: 600,
                    fontSize: 12,
                  }}>
                    <span>Total Declared Value</span>
                    <span>${(total / 100).toFixed(2)}</span>
                  </div>

                  <div className="dmv-notice" style={{ marginTop: 14, fontSize: 10 }}>
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
