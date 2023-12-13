import { NextResponse } from 'next/server'
import { auth } from './auth'

const protectedPath = (pathname: string) =>
  ['/account', '/edit'].find((path) => pathname.startsWith(path))

const systemPath = (pathname: string) =>
  ['/api', '/_next', '/auth'].find((path) => pathname.startsWith(path))

export default auth(function middleware(request) {
  if (request.method === 'POST' || systemPath(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const splashEnabled = process.env.ENABLE_SPLASH === 'true'
  const user = request.auth?.user
  const userAllowed = user && request.auth?.user.role !== 'waitlist'

  if (!user && protectedPath(request.nextUrl.pathname)) {
    const loginPath = `/auth/sign-in?callbackUrl=${encodeURIComponent(
      request.url
    )}`
    return NextResponse.redirect(new URL(loginPath, request.url), {
      status: 307
    })
  }

  if (!splashEnabled || userAllowed) {
    if (request.nextUrl.pathname === '/splash') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  }

  if (!['/splash', '/auth/sign-in'].includes(request.nextUrl.pathname)) {
    return NextResponse.rewrite(new URL('/splash', request.url))
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
    '/((?!_next/static|_next/image|.+.png|.+.jpe?g|api/).*)'
  ]
}
