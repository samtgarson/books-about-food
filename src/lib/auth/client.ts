import {
  customSessionClient,
  magicLinkClient
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import type { auth } from 'src/auth'

export const authClient = createAuthClient({
  baseURL: typeof window === 'undefined' ? undefined : window.location.origin,
  plugins: [magicLinkClient(), customSessionClient<typeof auth>()]
})
