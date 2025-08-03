
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Prevent direct access to the admin dashboard pages if not logged in
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/mayyan-admin/') && path !== '/mayyan-admin') {
    // This is a simplified check. A real app would use httpOnly cookies.
    // We are checking for a header that we will assume our client-side sets upon successful login.
    // Since we can't access sessionStorage in middleware, this is a placeholder for real session management.
  }

  // Allow all other requests
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
