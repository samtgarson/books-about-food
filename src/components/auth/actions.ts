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
  await (
    auth.api as unknown as {
      signInMagicLink: (opts: {
        body: { email: string; callbackURL: string }
        headers: Headers
      }) => Promise<unknown>
    }
  ).signInMagicLink({
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
