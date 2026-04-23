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
    <div className="dmv-container" style={{ maxWidth: 440, margin: '40px auto' }}>
      <div className="dmv-card">
        <div className="dmv-card-header">
          <h2>Administrator Access</h2>
        </div>
        <div className="dmv-card-body">
          <div className="dmv-notice dmv-notice-danger">
            <strong>Restricted:</strong> This portal is for authorised personnel only.
            All access attempts are logged.
          </div>

          <form onSubmit={handleSubmit}>
            <div className="dmv-field">
              <label className="dmv-label dmv-required">Administrator Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="dmv-input"
              />
            </div>

            {error && (
              <div className="dmv-notice dmv-notice-danger" style={{ fontSize: 10 }}>
                <strong>Authentication Failed:</strong> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="dmv-button dmv-button-primary"
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
