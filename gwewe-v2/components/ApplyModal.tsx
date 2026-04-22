'use client'

import { useState } from 'react'

export default function ApplyModal({
  open,
  onClose,
  source = 'apply_button',
}: {
  open: boolean
  onClose: () => void
  source?: string
}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source }),
    })

    if (res.ok) {
      setStatus('success')
    } else {
      setStatus('error')
    }
  }

  function handleClose() {
    onClose()
    setTimeout(() => {
      setEmail('')
      setStatus('idle')
    }, 300)
  }

  if (!open) return null

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 50, 89, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 20,
        backdropFilter: 'blur(2px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--portal-card)',
          border: '1px solid var(--portal-border)',
          maxWidth: 440,
          width: '100%',
          boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
        }}
      >
        {/* Title bar */}
        <div style={{
          background: 'var(--portal-blue-dark)',
          color: 'rgba(255,255,255,0.8)',
          padding: '8px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'IBM Plex Mono, monospace' }}>
            Access Application
          </span>
          <button
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              width: 20,
              height: 20,
              cursor: 'pointer',
              fontSize: 11,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >×</button>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          {status === 'success' ? (
            <div>
              <div className="portal-label" style={{ marginBottom: 12, fontSize: 12 }}>
                Application Received
              </div>
              <div className="portal-notice portal-notice-success">
                <strong>Submitted.</strong> If approved, authorisation details will be issued by email.
              </div>
              <button
                onClick={handleClose}
                className="portal-btn"
                style={{ width: '100%', marginTop: 14 }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{
                fontFamily: 'Source Serif 4, Georgia, serif',
                fontSize: 16,
                fontWeight: 600,
                color: 'var(--portal-blue-dark)',
                marginBottom: 12,
              }}>
                Apply for Consideration
              </div>

              <p style={{ fontSize: 11, marginBottom: 18, color: 'var(--portal-text-muted)', lineHeight: 1.7 }}>
                Portal access is not publicly available. Applications are reviewed periodically.
                Approved applicants may receive authorisation for future drops, archive releases,
                and member communications.
              </p>

              <div className="portal-field">
                <label className="portal-label portal-label-required">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="portal-input"
                />
              </div>

              {status === 'error' && (
                <div className="portal-notice portal-notice-danger" style={{ fontSize: 10 }}>
                  <strong>Error:</strong> Unable to process application. Try again.
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button type="button" onClick={handleClose} className="portal-btn" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === 'loading' || !email}
                  className="portal-btn portal-btn-primary"
                  style={{ flex: 2 }}
                >
                  {status === 'loading' ? 'Submitting...' : 'Submit for Review'}
                </button>
              </div>

              <p style={{ fontSize: 9, color: 'var(--portal-text-faint)', marginTop: 14, textAlign: 'center', letterSpacing: 0.3 }}>
                By submitting, you consent to receive access-related communications from GWEWE.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
