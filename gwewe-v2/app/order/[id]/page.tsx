import Link from 'next/link'

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

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
        <div className="portal-card" style={{ maxWidth: 600, margin: '0 auto' }}>
          <div className="portal-card-header">
            <h2>Dispatch Record Filed</h2>
          </div>
          <div className="portal-card-body">
            <div className="portal-notice portal-notice-success">
              <strong>Confirmed:</strong> Order received and pending payment verification.
            </div>

            <table className="portal-table">
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600, background: 'var(--portal-bg)', width: 180 }}>Order Reference</td>
                  <td className="portal-ref" style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2 }}>{id}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, background: 'var(--portal-bg)' }}>Status</td>
                  <td><span className="portal-status portal-status-pending">Pending Verification</span></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, background: 'var(--portal-bg)' }}>Filed</td>
                  <td style={{ fontSize: 11 }}>{new Date().toLocaleString('en-US')}</td>
                </tr>
              </tbody>
            </table>

            <div className="portal-divider" />

            <div className="portal-label" style={{ marginBottom: 8 }}>Processing Sequence</div>
            <div style={{ fontSize: 11, lineHeight: 2 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: 'var(--portal-text-faint)', width: 16 }}>01</span>
                <span>Payment verified on approved network</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: 'var(--portal-text-faint)', width: 16 }}>02</span>
                <span>Confirmation issued by email</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: 'var(--portal-text-faint)', width: 16 }}>03</span>
                <span>Order processed within 2 business days</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: 'var(--portal-text-faint)', width: 16 }}>04</span>
                <span>Tracking reference issued upon dispatch</span>
              </div>
            </div>

            <div className="portal-notice portal-notice-danger" style={{ marginTop: 20 }}>
              <strong>Retain your reference number</strong> for all correspondence regarding this order.
            </div>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link href="/shop" className="portal-btn">
                ← Return to Catalogue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
