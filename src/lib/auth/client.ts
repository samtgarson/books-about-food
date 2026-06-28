import {
  customSessionClient,
  magicLinkClient
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import type { auth } from 'src/auth'

export const authClient = createAuthClient({
  // Without this, Better Auth resolves the base from BASE_URL (not exposed to
  // the browser) and falls back to the server's address (localhost:8080),
  // producing invalid callbackURLs. Use the actual browser origin.
  baseURL: typeof window === 'undefined' ? undefined : window.location.origin,
  plugins: [magicLinkClient(), customSessionClient<typeof auth>()]
})
