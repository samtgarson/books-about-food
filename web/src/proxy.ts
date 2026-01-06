import { NextResponse } from 'next/server'
import { auth } from './auth'

const protectedPath = (pathname: string) =>
  ['/admin', '/account', '/edit'].some((path) => pathname.startsWith(path))

const systemPath = (pathname: string) =>
  ['/api', '/_next', '/auth'].some((path) => pathname.startsWith(path))

// const { auth } = NextAuth(authConfig)

export default auth(async function proxy(request) {
  if (request.method === 'POST' || systemPath(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const user = request.auth?.user
  if (!user && protectedPath(request.nextUrl.pathname)) {
    const loginPath = `/auth/sign-in?callbackUrl=${encodeURIComponent(
      request.url
    )}`
    return NextResponse.redirect(new URL(loginPath, request.url), {
      status: 307
    })
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
    {
      source:
        '/((?!_next/static|_next/image|.+.png|.+.ico|.+.jpe?g|api/|monitoring).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' }
      ]
    }
  ]
}
