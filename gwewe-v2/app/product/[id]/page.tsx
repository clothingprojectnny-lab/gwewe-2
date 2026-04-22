import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/db'
import ProductClient from './ProductClient'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product || !product.active) notFound()

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
        <div className="portal-breadcrumb">
          <Link href="/shop">Catalogue</Link>
          <span>›</span>
          <span style={{ color: 'var(--portal-text-muted)' }}>Item Record — {product.name}</span>
        </div>

        <ProductClient product={product} />
      </div>
    </>
  )
}
