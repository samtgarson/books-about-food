'use server'

import { SignJWT } from 'jose'
import { getEnv } from '../../utils/get-env'
import { getSessionUser } from '../../utils/user'

const secret = new TextEncoder().encode(getEnv('ADMIN_API_SECRET'))

export async function getAdminToken() {
  const user = await getSessionUser()
  if (!user) throw new Error('No user found')
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('5m')
    .sign(secret)
  return token
}
