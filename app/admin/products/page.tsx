import Link from 'next/link'
import { getAllProducts } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const products = await getAllProducts()

  return (
    <div className="dmv-card">
      <div className="dmv-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Product Management</h2>
        <Link href="/admin/products/new" className="dmv-button dmv-button-primary">
          + Add Product
        </Link>
      </div>
      <div className="dmv-card-body">
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--dmv-grey-dark)' }}>
            No products in system. Click &quot;Add Product&quot; to begin.
          </div>
        ) : (
          <table className="dmv-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Image</th>
                <th>Name</th>
                <th style={{ width: 100 }}>Reference</th>
                <th style={{ width: 90 }}>Value</th>
                <th style={{ width: 60 }}>Stock</th>
                <th style={{ width: 90 }}>Status</th>
                <th style={{ width: 70 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const totalStock = Object.values(product.stock || {}).reduce((a, b) => a + b, 0)
                return (
                  <tr key={product.id}>
                    <td style={{ padding: 4 }}>
                      <div style={{ width: 40, height: 50, background: 'var(--dmv-grey-light)', overflow: 'hidden', border: '1px solid var(--dmv-border)' }}>
                        {product.images?.[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{product.name}</td>
                    <td className="dmv-ref">{product.id.toUpperCase()}</td>
                    <td>${(product.price / 100).toFixed(2)}</td>
                    <td>{totalStock}</td>
                    <td>
                      {product.active ? (
                        <span className="dmv-status dmv-status-cleared">Visible</span>
                      ) : (
                        <span className="dmv-status dmv-status-withheld">Withheld</span>
                      )}
                    </td>
                    <td>
                      <Link href={`/admin/products/${product.id}`} className="dmv-button" style={{ fontSize: 9, padding: '4px 10px' }}>
                        Edit
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
  )
}
