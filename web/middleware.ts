import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

const protectedPath = (pathname: string) =>
  ['/account', '/edit'].find((path) => pathname.startsWith(path))

export default withAuth(
  function middleware(request) {
    if (process.env.ENABLE_SPLASH) {
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
