'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminNav() {
  const pathname = usePathname()

  if (pathname === '/admin/login') return null

  return (
    <nav className="dmv-nav">
      <div className="dmv-nav-inner">
        <Link href="/admin/products" className={pathname?.startsWith('/admin/products') ? 'active' : ''}>
          Products
        </Link>
        <Link href="/admin/orders" className={pathname?.startsWith('/admin/orders') ? 'active' : ''}>
          Orders
        </Link>
        <Link href="/admin/customers" className={pathname?.startsWith('/admin/customers') ? 'active' : ''}>
          Customers
        </Link>
        <Link href="/shop">View Portal</Link>
      </div>
    </nav>
  )
}
