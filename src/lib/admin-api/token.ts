'use server'

import { sign } from 'jsonwebtoken'
import { getEnv } from '../../utils/get-env'
import { getSessionUser } from '../../utils/user'

const secret = getEnv('ADMIN_API_SECRET')

export async function getAdminToken() {
  const user = await getSessionUser()
  if (!user) throw new Error('No user found')
  const token = sign(user, secret, { expiresIn: '5m' })
  return token
}
