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
        <div className="dmv-page">
          <div className="dmv-top-bar" />
          <header className="dmv-header">
            <div className="dmv-header-inner">
              <div>
                <a href="/shop" className="dmv-logo">
                  GWEWE<span className="dmv-logo-sub">PORTAL</span>
                </a>
                <div className="dmv-tagline">MEMBER ACCESS SERVICES · EST. MMXXVI</div>
              </div>
            </div>
          </header>
          {children}
          <footer className="dmv-footer">
            <div>
              <a href="/shop">Catalogue</a>
              <a href="/enter">Access Portal</a>
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">Contact</a>
            </div>
            <div className="dmv-footer-copyright">
              Copyright © MMXXVI · GWEWE Portal System · All Rights Reserved
            </div>
          </footer>
        </div>
        <NewsletterPopup />
      </body>
    </html>
  )
}
