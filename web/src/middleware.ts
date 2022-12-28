import { withAuth, WithAuthArgs } from 'next-auth/middleware'

export default function Middleware(...args: WithAuthArgs) {
  console.log(args)
  return withAuth(...args)
}

export const config = {
  matcher: ['/account']
}
