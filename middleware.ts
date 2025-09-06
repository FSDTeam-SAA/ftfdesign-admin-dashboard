import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

 
  const PUBLIC_ROUTES = [
    '/login',
    '/forgot-password',
    '/update-password',
    '/verify-otp',
    '/api/auth',
    '/_next',
    '/favicon.ico'
  ]

  // Public route হলে skip
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Token check
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // // Admin role check
  // if (pathname.startsWith('/dashboard') && token.role !== 'admin') {
 
  //   return NextResponse.redirect(new URL('/login', req.url))
  // }

  return NextResponse.next()
}

export const config = {
  
  matcher: ['/dashboard/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
}
