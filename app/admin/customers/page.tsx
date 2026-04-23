import { getCustomers } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function CustomersPage() {
  const customers = await getCustomers()

  return (
    <div className="dmv-card">
      <div className="dmv-card-header">
        <h2>Member Records</h2>
      </div>
      <div className="dmv-card-body">
        {customers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--dmv-grey-dark)' }}>
            No member records.
          </div>
        ) : (
          <table className="dmv-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th style={{ width: 70 }}>Orders</th>
                <th style={{ width: 100 }}>Total Value</th>
                <th style={{ width: 110 }}>Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.email}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.orders.length}</td>
                  <td>${(c.totalSpent / 100).toFixed(2)}</td>
                  <td style={{ fontSize: 10 }}>{new Date(c.lastOrder).toLocaleDateString('en-US')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
