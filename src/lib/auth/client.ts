import {
  customSessionClient,
  magicLinkClient
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import type { Auth } from 'src/auth'

export const authClient = createAuthClient({
  plugins: [magicLinkClient(), customSessionClient<Auth>()]
})
