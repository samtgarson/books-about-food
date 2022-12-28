import { withAuth, WithAuthArgs } from 'next-auth/middleware'

export default function Middleware(...args: WithAuthArgs) {
  return withAuth(...args)
}

export const config = {
  matcher: ['/account']
}
