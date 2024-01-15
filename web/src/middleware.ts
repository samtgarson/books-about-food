import { NextResponse } from 'next/server'
import { auth } from './auth'
import { userApproved } from './utils/authorization'

const protectedPath = (pathname: string) =>
  ['/account', '/edit'].some((path) => pathname.startsWith(path))

const systemPath = (pathname: string) =>
  ['/api', '/_next', '/auth'].some((path) => pathname.startsWith(path))

const publicPages = ['/', '/auth/sign-in', '/about']

export default auth(function middleware(request) {
  if (request.method === 'POST' || systemPath(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const user = request.auth?.user
  const userAllowed = userApproved(user)
  if (!user && protectedPath(request.nextUrl.pathname)) {
    const loginPath = `/auth/sign-in?callbackUrl=${encodeURIComponent(
      request.url
    )}`
    return NextResponse.redirect(new URL(loginPath, request.url), {
      status: 307
    })
  }

  if (userAllowed) {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/splash', request.url))
  }

  if (!publicPages.includes(request.nextUrl.pathname)) {
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
