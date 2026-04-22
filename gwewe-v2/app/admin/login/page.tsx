'use client'

import { useState } from 'react'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        window.location.href = '/admin/products'
      } else {
        const data = await res.json().catch(() => ({ error: 'Access denied' }))
        setError(data.error || 'Access denied')
        setLoading(false)
      }
    } catch {
      setError('Network error')
      setLoading(false)
    }
  }

  return (
    <div className="portal-container" style={{ maxWidth: 440, margin: '40px auto' }}>
      <div className="portal-card">
        <div className="portal-card-header">
          <h2>Administrator Access</h2>
        </div>
        <div className="portal-card-body">
          <div className="portal-notice portal-notice-danger">
            <strong>Restricted:</strong> This portal is for authorised personnel only.
            All access attempts are logged.
          </div>

          <form onSubmit={handleSubmit}>
            <div className="portal-field">
              <label className="portal-label portal-label-required">Administrator Password</label>
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
                <strong>Authentication Failed:</strong> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="portal-btn portal-btn-primary"
              style={{ width: '100%' }}
            >
              {loading ? 'Verifying...' : 'Enter →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
