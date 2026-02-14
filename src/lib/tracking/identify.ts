import { headers } from 'next/headers'
import { ip, token, trackingEnabled } from './utils'

export interface IdentifyUser {
  id: string
  name?: string
  email: string
  image?: string
}

export const identify = async ({ id, name, email, image }: IdentifyUser) => {
  if (!trackingEnabled) return
  if (!token) return

  const h = await headers()
  const body = {
    $token: token,
    $distinct_id: id,
    $ip: ip(h),
    $set: {
      $name: name,
      $email: email,
      $avatar: image
    }
  }

  await fetch(`https://api.mixpanel.com/engage#profile-set?ip=0`, {
    method: 'POST',
    body: JSON.stringify([body]),
    headers: { 'content-type': 'application/json', accept: 'text/plain' }
  })
}
