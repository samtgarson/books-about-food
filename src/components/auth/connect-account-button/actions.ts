'use client'

import { authClient } from 'src/lib/auth/client'

export function connectAccount(provider: string) {
  return authClient.linkSocial({
    provider: provider as 'google',
    callbackURL: '/account'
  })
}
