import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

const protectedPath = (pathname: string) =>
  ['/account', '/edit'].find((path) => pathname.startsWith(path))

const systemPath = (pathname: string) =>
  ['/api', '/_next', '/auth'].find((path) => pathname.startsWith(path))

export default withAuth(
  function middleware(request) {
    if (request.method === 'POST' || systemPath(request.nextUrl.pathname)) {
      return
    }

    if (
      process.env.ENABLE_SPLASH ||
      request.nextUrl.hostname === 'www.booksaboutfood.info'
    ) {
      return NextResponse.rewrite(new URL('/splash', request.url))
    }

    if (
      request.nextauth.token?.role === 'waitlist' &&
      protectedPath(request.nextUrl.pathname)
    ) {
      return NextResponse.rewrite(new URL('/waitlist', request.url))
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
