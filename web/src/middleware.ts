import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

const protectedPath = (pathname: string) =>
  ['/account', '/edit'].find((path) => pathname.startsWith(path))

const systemPath = (pathname: string) =>
  ['/api', '/_next', '/auth'].find((path) => pathname.startsWith(path))

export default withAuth(
  function middleware(request) {
    if (request.method === 'POST' || systemPath(request.nextUrl.pathname)) {
      return NextResponse.next()
    }

    const splashEnabled =
      request.nextUrl.host === 'booksaboutfood.info' ||
      process.env.ENABLE_SPLASH
    const userAllowed =
      request.nextauth.token && request.nextauth.token.role !== 'waitlist'

    if (!splashEnabled || userAllowed) {
      if (request.nextUrl.pathname === '/splash') {
        return NextResponse.redirect(new URL('/', request.url))
      }

      return NextResponse.next()
    }

    if (request.nextUrl.pathname !== '/splash') {
      return NextResponse.redirect(new URL('/splash', request.url))
    }
  },
  {
    callbacks: {
      authorized({ req, token }) {
        return !protectedPath(req.nextUrl.pathname) || !!token
      }
    }
  }
)

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
