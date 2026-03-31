'use server'

import { headers } from 'next/headers'
import { auth } from 'src/auth'

export async function emailSignIn({
  email,
  redirect
}: {
  email: string
  redirect?: string
}) {
  // auth.api doesn't carry magic-link plugin types because PayloadAuthOptions
  // erases plugin generics. This is a payload-auth typing limitation.
  const api = auth.api as typeof auth.api & {
    signInMagicLink: (opts: {
      body: { email: string; callbackURL: string }
      headers: Headers
    }) => Promise<{ status: boolean }>
  }

  await api.signInMagicLink({
    body: {
      email,
      callbackURL: redirect || '/'
    },
    headers: await headers()
  })
}

export async function signOut() {
  await auth.api.signOut({
    headers: await headers()
  })
}
