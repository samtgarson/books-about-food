import { createAuthClient } from 'better-auth/react'
import { magicLinkClient, customSessionClient } from 'better-auth/client/plugins'
import type { auth } from 'src/auth'

export const authClient = createAuthClient({
  plugins: [magicLinkClient(), customSessionClient<typeof auth>()]
})
