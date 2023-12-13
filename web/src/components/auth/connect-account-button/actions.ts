'use server'

import { actions } from 'src/auth'

export async function connectAccount(provider: string) {
  await actions.signIn(provider, {
    redirect: true,
    redirectTo: '/account'
  })
}
