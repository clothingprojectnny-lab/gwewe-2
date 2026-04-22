'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ApplyModal from '@/components/ApplyModal'

export default function EnterPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [applyOpen, setApplyOpen] = useState(false)
  const [applySource, setApplySource] = useState<'apply_button' | 'enquiry_link'>('apply_button')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/shop')
    } else {
      setError(true)
      setLoading(false)
    }
  }

  function openApply(source: 'apply_button' | 'enquiry_link') {
    setApplySource(source)
    setApplyOpen(true)
  }

  return (
    <>
      <div className="portal-container">
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: 20 }} className="portal-grid-2">
          {/* Main panel */}
          <div className="portal-card">
            <div className="portal-card-header">
              <h2>Authorised Access Only</h2>
            </div>
            <div className="portal-card-body">
              <p style={{ marginBottom: 14 }}>
                The GWEWE Portal provides approved members with access to current releases,
                archived garments, order records, and restricted catalogue material.
              </p>

              <p style={{ marginBottom: 18, color: 'var(--portal-text-muted)' }}>
                Access is issued by code only. Unauthorised entry, duplication, or redistribution
                of portal materials is prohibited.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                {['No public storefront.', 'No retail intermediaries.', 'Direct fulfilment only.'].map((text, i) => (
                  <div key={i} style={{
                    padding: '10px 12px',
                    background: 'var(--portal-bg)',
                    border: '1px solid var(--portal-border)',
                    fontSize: 10,
                    letterSpacing: '0.5px',
                    color: 'var(--portal-text-muted)',
                    textAlign: 'center',
                  }}>
                    {text}
                  </div>
                ))}
              </div>

              <div className="portal-notice portal-notice-danger">
                <strong>Notice:</strong> Portal access is limited to approved members.
                Keep your access code available before proceeding.
              </div>

              <p style={{ fontSize: 11, color: 'var(--portal-text-faint)', marginTop: 16 }}>
                For access enquiries or membership issues,{' '}
                <button
                  type="button"
                  onClick={() => openApply('enquiry_link')}
                  className="portal-btn-link"
                >
                  submit a request
                </button>
                {' '}through the contact channel.
              </p>
            </div>
          </div>

          {/* Access panel */}
          <div>
            <div className="portal-card" style={{ marginBottom: 20 }}>
              <div className="portal-card-header">
                <h2>Enter Portal</h2>
              </div>
              <div className="portal-card-body">
                <form onSubmit={handleSubmit}>
                  <div className="portal-field">
                    <label className="portal-label portal-label-required">Access Code</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoFocus
                      className="portal-input"
                    />
                  </div>

                  {error && (
                    <div className="portal-notice portal-notice-danger" style={{ fontSize: 10 }}>
                      <strong>Error:</strong> Code not recognised. Entry denied.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !password}
                    className="portal-btn portal-btn-primary"
                    style={{ width: '100%' }}
                  >
                    {loading ? 'Verifying...' : 'Enter Portal'}
                  </button>
                </form>
              </div>
            </div>

            <div className="portal-card">
              <div className="portal-card-header">
                <h2>Access Request</h2>
              </div>
              <div className="portal-card-body" style={{ padding: 0, overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/dsky.png"
                  alt=""
                  style={{
                    width: '100%',
                    height: 120,
                    objectFit: 'cover',
                    display: 'block',
                    filter: 'grayscale(30%) contrast(1.1)',
                  }}
                />
                <div style={{ padding: '14px 20px' }}>
                  <button
                    onClick={() => openApply('apply_button')}
                    className="portal-btn"
                    style={{ width: '100%', textAlign: 'center' }}
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ApplyModal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        source={applySource}
      />
    </>
  )
}
