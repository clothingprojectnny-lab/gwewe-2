import type { Metadata } from 'next'
import './globals.css'
import NewsletterPopup from '@/components/NewsletterPopup'

export const metadata: Metadata = {
  title: 'GWEWE — Member Portal',
  description: '',
  robots: { index: false, follow: false },
}
 
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="portal-page">
          <div className="portal-classification-bar">
            Restricted Access · Authorised Personnel Only · GWEWE Portal System
          </div>
          <header className="portal-header">
            <div className="portal-header-inner">
              <div>
                <a href="/shop" className="portal-logo">GWEWE</a>
                <span className="portal-logo-sub">Member Access Services</span>
              </div>
              <div className="portal-header-ref">
                Portal Ref: GW-MMXXVI<br />
                System Status: Active
              </div>
            </div>
          </header>
          <div className="portal-accent-bar" />
          {children}
          <footer className="portal-footer">
            <div>
              <a href="/shop">Catalogue</a>
              <a href="/enter">Access Portal</a>
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">Contact</a>
            </div>
            <div className="portal-footer-divider" />
            <div>
              GWEWE PORTAL SYSTEM · EST. MMXXVI · ALL RIGHTS RESERVED
            </div>
          </footer>
        </div>
        <NewsletterPopup />
      </body>
    </html>
  )
}
