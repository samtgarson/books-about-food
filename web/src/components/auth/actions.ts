'use server'

import { actions } from 'src/auth'

export async function emailSignIn({
  email,
  redirect
}: {
  email: string
  redirect?: string
}) {
  await actions.signIn('email', {
    email,
    redirect: false,
    redirectTo: redirect || '/'
  })
}

export async function googleSignIn(redirect = '/') {
  await actions.signIn('google', {
    redirect: true,
    redirectTo: redirect
  })
}

export async function signOut() {
  await actions.signOut({ redirectTo: '/', redirect: true })
}
