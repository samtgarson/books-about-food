import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(request) {
    if (process.env.ENABLE_SPLASH) {
      return NextResponse.rewrite(new URL('/splash', request.url))
    }
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const protectedPath = ['/account', '/edit'].find((path) =>
          req.nextUrl.pathname.startsWith(path)
        )
        return !protectedPath || !!token
      }
    }
  }
)
