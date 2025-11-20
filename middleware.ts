import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only handle admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const response = NextResponse.next()
    
    // Add header to inject hydration fix script
    response.headers.set('x-inject-admin-script', 'true')
    
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}