'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product } from '@/lib/db'

export default function ProductClient({ product }: { product: Product }) {
  const router = useRouter()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [mainImage, setMainImage] = useState(0)

  const availableSizes = product.sizes.filter(s => (product.stock?.[s] || 0) > 0)

  function handleAddToCart() {
    if (!selectedSize) return
    const cart = JSON.parse(sessionStorage.getItem('gwewe_cart') || '[]')
    cart.push({
      productId: product.id,
      productName: product.name,
      size: selectedSize,
      price: product.price,
    })
    sessionStorage.setItem('gwewe_cart', JSON.stringify(cart))
    router.push('/checkout')
  }

  return (
    <div className="dmv-card">
      <div className="dmv-card-header">
        <h2>Item Record — {product.name}</h2>
      </div>
      <div className="dmv-card-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="dmv-row">
          {/* Image gallery */}
          <div>
            <div style={{
              width: '100%',
              aspectRatio: '3/4',
              background: 'var(--dmv-grey-light)',
              border: '1px solid var(--dmv-border)',
              overflow: 'hidden',
            }}>
              {product.images?.[mainImage] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[mainImage]}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, marginTop: 8 }}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(i)}
                    style={{
                      aspectRatio: '1',
                      padding: 0,
                      border: mainImage === i ? '2px solid var(--dmv-blue)' : '1px solid var(--dmv-border)',
                      background: 'var(--dmv-card)',
                      cursor: 'pointer',
                      overflow: 'hidden',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item details */}
          <div>
            <table className="dmv-table" style={{ marginBottom: 20 }}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600, width: 150, background: 'var(--dmv-grey-light)' }}>Issue Reference</td>
                  <td className="dmv-ref" style={{ fontSize: 12 }}>{product.id.toUpperCase()}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, background: 'var(--dmv-grey-light)' }}>Item Description</td>
                  <td style={{ fontWeight: 600 }}>{product.name}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, background: 'var(--dmv-grey-light)' }}>Declared Value</td>
                  <td style={{ fontWeight: 600, fontSize: 14 }}>${(product.price / 100).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, background: 'var(--dmv-grey-light)' }}>Clearance Status</td>
                  <td>
                    {availableSizes.length > 0 ? (
                      <span className="dmv-status dmv-status-cleared">Cleared</span>
                    ) : (
                      <span className="dmv-status dmv-status-restricted">Access Restricted</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, background: 'var(--dmv-grey-light)' }}>Fulfilment Method</td>
                  <td style={{ fontSize: 11, color: 'var(--dmv-grey-dark)' }}>Direct dispatch upon payment confirmation</td>
                </tr>
              </tbody>
            </table>

            {product.description && (
              <div style={{ marginBottom: 18 }}>
                <div className="dmv-label">Item Notes</div>
                <p style={{ fontSize: 11, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{product.description}</p>
              </div>
            )}

            {/* Size selector */}
            <div className="dmv-field">
              <label className="dmv-label dmv-required">Select Size</label>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {product.sizes.map(size => {
                  const available = availableSizes.includes(size)
                  return (
                    <button
                      key={size}
                      onClick={() => available && setSelectedSize(size)}
                      disabled={!available}
                      className="dmv-button"
                      style={{
                        minWidth: 48,
                        textAlign: 'center',
                        ...(selectedSize === size ? {
                          background: 'var(--dmv-blue-dark)',
                          borderColor: 'var(--dmv-blue-dark)',
                          color: 'white',
                        } : {}),
                        ...(!available ? {
                          textDecoration: 'line-through',
                          opacity: 0.3,
                        } : {}),
                      }}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="dmv-button dmv-button-primary"
              style={{ width: '100%', padding: '10px', fontSize: 11, marginTop: 8 }}
            >
              Proceed to Checkout →
            </button>

            <div className="dmv-notice dmv-notice-info" style={{ marginTop: 16 }}>
              This garment has been cleared for current issue.
              Availability may be withdrawn without notice.
            </div>

            {/* Additional info */}
            {(product.sizeChart || product.materials || product.care) && (
              <div style={{ marginTop: 20 }}>
                <div className="dmv-divider" />
                <div className="dmv-label" style={{ marginBottom: 10 }}>Supplementary Data</div>
                <table className="dmv-table">
                  <tbody>
                    {product.sizeChart && (
                      <tr>
                        <td style={{ fontWeight: 600, width: 140, background: 'var(--dmv-grey-light)', verticalAlign: 'top' }}>
                          Size Reference
                        </td>
                        <td style={{ whiteSpace: 'pre-wrap', fontSize: 10 }}>{product.sizeChart}</td>
                      </tr>
                    )}
                    {product.materials && (
                      <tr>
                        <td style={{ fontWeight: 600, background: 'var(--dmv-grey-light)', verticalAlign: 'top' }}>
                          Composition
                        </td>
                        <td style={{ whiteSpace: 'pre-wrap', fontSize: 10 }}>{product.materials}</td>
                      </tr>
                    )}
                    {product.care && (
                      <tr>
                        <td style={{ fontWeight: 600, background: 'var(--dmv-grey-light)', verticalAlign: 'top' }}>
                          Handling Notes
                        </td>
                        <td style={{ whiteSpace: 'pre-wrap', fontSize: 10 }}>{product.care}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
