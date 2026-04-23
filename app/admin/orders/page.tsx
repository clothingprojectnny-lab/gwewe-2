import Link from 'next/link'
import { getAllOrders } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const orders = await getAllOrders()

  return (
    <div className="dmv-card">
      <div className="dmv-card-header">
        <h2>Order Management</h2>
      </div>
      <div className="dmv-card-body">
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--dmv-grey-dark)' }}>
            No orders in system.
          </div>
        ) : (
          <table className="dmv-table">
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
                  <td className="dmv-ref" style={{ fontWeight: 600 }}>{order.id}</td>
                  <td>{order.shipping.name}</td>
                  <td>${(order.total / 100).toFixed(2)}</td>
                  <td style={{ fontSize: 10 }}>{new Date(order.createdAt).toLocaleDateString('en-US')}</td>
                  <td><span className={`dmv-status dmv-status-${order.status}`}>{order.status}</span></td>
                  <td><Link href={`/admin/orders/${order.id}`} className="dmv-button" style={{ fontSize: 9, padding: '4px 10px' }}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
