// Update the existing middleware.ts in your repo with this
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin routes
  if (pathname.startsWith('/admin')) {
    // Allow login page
    if (pathname === '/admin/login') return NextResponse.next()
    // Check admin session
    const adminSession = request.cookies.get('gwewe_admin')
    if (!adminSession || adminSession.value !== process.env.ADMIN_SESSION_TOKEN) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.next()
  }

  // Admin API routes (also protected)
  if (pathname.startsWith('/api/admin')) {
    if (pathname === '/api/admin/auth') return NextResponse.next()
    const adminSession = request.cookies.get('gwewe_admin')
    if (!adminSession || adminSession.value !== process.env.ADMIN_SESSION_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.next()
  }

  // Public site — allow /enter and /api/auth, gate everything else
  if (pathname === '/enter' || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  const session = request.cookies.get('gwewe_session')
  if (!session || session.value !== process.env.SESSION_TOKEN) {
    return NextResponse.redirect(new URL('/enter', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt).*)'],
}
