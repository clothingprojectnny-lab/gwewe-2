import Link from 'next/link'
import { getActiveProducts } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const products = await getActiveProducts()

  return (
    <>
      <nav className="dmv-nav">
        <div className="dmv-nav-inner">
          <Link href="/shop" className="active">Catalogue</Link>
          <Link href="#">Records</Link>
          <Link href="#">Access Log</Link>
          <Link href="#">Member File</Link>
          <Link href="#">Contact</Link>
          <Link href="/enter">Exit Portal</Link>
        </div>
      </nav>

      <div className="dmv-container">
        <div className="dmv-card">
          <div className="dmv-card-header">
            <h2>Current Issue Catalogue</h2>
          </div>
          <div className="dmv-card-body">
            <div className="dmv-notice">
              <strong>Notice:</strong> Item availability is subject to change without notice.
              Prices are listed in USD unless otherwise stated.
            </div>

            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <p style={{ fontSize: 13, color: 'var(--dmv-grey-dark)', marginBottom: 6 }}>
                  No items currently issued.
                </p>
                <p style={{ fontSize: 11, color: 'var(--dmv-grey-dark)' }}>
                  Check back for future releases.
                </p>
              </div>
            ) : (
              <table className="dmv-table" style={{ marginTop: 16 }}>
                <thead>
                  <tr>
                    <th style={{ width: 90 }}>Image</th>
                    <th>Description</th>
                    <th style={{ width: 110 }}>Reference</th>
                    <th style={{ width: 110 }}>Declared Value</th>
                    <th style={{ width: 110 }}>Availability</th>
                    <th style={{ width: 100 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => {
                    const totalStock = Object.values(product.stock || {}).reduce((a, b) => a + b, 0)
                    return (
                      <tr key={product.id}>
                        <td style={{ padding: 6 }}>
                          <Link href={`/product/${product.id}`}>
                            <div style={{
                              width: 70,
                              height: 90,
                              background: 'var(--dmv-grey-light)',
                              border: '1px solid var(--dmv-border)',
                              overflow: 'hidden',
                            }}>
                              {product.images?.[0] && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={product.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              )}
                            </div>
                          </Link>
                        </td>
                        <td>
                          <Link href={`/product/${product.id}`} style={{ fontWeight: 600, fontSize: 12, color: 'var(--dmv-text)' }}>
                            {product.name}
                          </Link>
                          {product.description && (
                            <div style={{ fontSize: 10, color: 'var(--dmv-grey-dark)', marginTop: 3, lineHeight: 1.4 }}>
                              {product.description.substring(0, 80)}{product.description.length > 80 ? '...' : ''}
                            </div>
                          )}
                        </td>
                        <td className="dmv-ref">
                          {product.id.toUpperCase()}
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          ${(product.price / 100).toFixed(2)}
                        </td>
                        <td>
                          {totalStock > 0 ? (
                            <span className="dmv-status dmv-status-cleared">Cleared</span>
                          ) : (
                            <span className="dmv-status dmv-status-restricted">Restricted</span>
                          )}
                        </td>
                        <td>
                          <Link href={`/product/${product.id}`} className="dmv-button" style={{ fontSize: 9, padding: '5px 12px' }}>
                            Open Record
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
