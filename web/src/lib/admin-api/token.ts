'use server'

import { getEnv } from '@books-about-food/shared/utils/get-env'
import { SignJWT } from 'jose'
import { getSessionUser } from '../../utils/user'

const secret = getEnv('ADMIN_API_SECRET')

export async function getAdminToken() {
  const user = await getSessionUser()
  if (!user) throw new Error('No user found')

  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + 60 * 5 // 5 minutes
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(new TextEncoder().encode(secret))

  return token
}
