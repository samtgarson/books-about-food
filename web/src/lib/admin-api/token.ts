'use server'

import { getEnv } from '@books-about-food/shared/utils/get-env'
import { sign } from 'jsonwebtoken'
import { getSessionUser } from '../../utils/user'

const secret = getEnv('ADMIN_API_SECRET')

export async function getAdminToken() {
  const user = await getSessionUser()
  if (!user) throw new Error('No user found')
  const token = sign(user, secret, { expiresIn: '5m' })
  return token
}
