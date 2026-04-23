import AdminNav from './AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNav />
      <div className="dmv-container">
        {children}
      </div>
    </>
  )
}
