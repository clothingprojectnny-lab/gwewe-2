import Link from 'next/link'

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

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
        <div className="dmv-card" style={{ maxWidth: 600, margin: '0 auto' }}>
          <div className="dmv-card-header">
            <h2>Dispatch Record Filed</h2>
          </div>
          <div className="dmv-card-body">
            <div className="dmv-notice dmv-notice-success">
              <strong>Confirmed:</strong> Order received and pending payment verification.
            </div>

            <table className="dmv-table">
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600, background: 'var(--dmv-grey-light)', width: 180 }}>Order Reference</td>
                  <td className="dmv-ref" style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2 }}>{id}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, background: 'var(--dmv-grey-light)' }}>Status</td>
                  <td><span className="dmv-status dmv-status-pending">Pending Verification</span></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, background: 'var(--dmv-grey-light)' }}>Filed</td>
                  <td style={{ fontSize: 11 }}>{new Date().toLocaleString('en-US')}</td>
                </tr>
              </tbody>
            </table>

            <div className="dmv-divider" />

            <div className="dmv-label" style={{ marginBottom: 8 }}>Processing Sequence</div>
            <div style={{ fontSize: 11, lineHeight: 2 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: 'var(--dmv-grey-dark)', width: 16 }}>01</span>
                <span>Payment verified on approved network</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: 'var(--dmv-grey-dark)', width: 16 }}>02</span>
                <span>Confirmation issued by email</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: 'var(--dmv-grey-dark)', width: 16 }}>03</span>
                <span>Order processed within 2 business days</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: 'var(--dmv-grey-dark)', width: 16 }}>04</span>
                <span>Tracking reference issued upon dispatch</span>
              </div>
            </div>

            <div className="dmv-notice dmv-notice-danger" style={{ marginTop: 20 }}>
              <strong>Retain your reference number</strong> for all correspondence regarding this order.
            </div>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link href="/shop" className="dmv-button">
                ← Return to Catalogue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
