import { NextResponse } from 'next/server'
import { auth } from './auth'

const protectedPath = (pathname: string) =>
  ['/account', '/edit'].some((path) => pathname.startsWith(path))

const systemPath = (pathname: string) =>
  ['/api', '/_next', '/auth'].some((path) => pathname.startsWith(path))

export default auth(function middleware(request) {
  if (request.method === 'POST' || systemPath(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const splashEnabled = process.env.ENABLE_SPLASH === 'true'
  const user = request.auth?.user
  const userAllowed = user && user?.role !== 'waitlist'

  if (!user && protectedPath(request.nextUrl.pathname)) {
    const loginPath = `/auth/sign-in?callbackUrl=${encodeURIComponent(
      request.url
    )}`
    return NextResponse.redirect(new URL(loginPath, request.url), {
      status: 307
    })
  }

  if (!splashEnabled || userAllowed) {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/splash', request.url))
  }

  if (!['/', '/auth/sign-in'].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon and apple icon images
     */
    '/((?!_next/static|_next/image|.+.png|.+.jpe?g|api/|monitoring).*)'
  ]
}
