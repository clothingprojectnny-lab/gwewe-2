import Link from 'next/link'
import { getAllOrders } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const orders = await getAllOrders()

  return (
    <div className="portal-card">
      <div className="portal-card-header">
        <h2>Order Management</h2>
      </div>
      <div className="portal-card-body">
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--portal-text-faint)' }}>
            No orders in system.
          </div>
        ) : (
          <table className="portal-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Recipient</th>
                <th style={{ width: 100 }}>Value</th>
                <th style={{ width: 110 }}>Filed</th>
                <th style={{ width: 110 }}>Status</th>
                <th style={{ width: 70 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="portal-ref" style={{ fontWeight: 600 }}>{order.id}</td>
                  <td>{order.shipping.name}</td>
                  <td>${(order.total / 100).toFixed(2)}</td>
                  <td style={{ fontSize: 10 }}>{new Date(order.createdAt).toLocaleDateString('en-US')}</td>
                  <td><span className={`portal-status portal-status-${order.status}`}>{order.status}</span></td>
                  <td><Link href={`/admin/orders/${order.id}`} className="portal-btn" style={{ fontSize: 9, padding: '4px 10px' }}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
