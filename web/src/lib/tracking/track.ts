'use server'
import { cookies, headers } from 'next/headers'
import { NextRequest, NextResponse, userAgent } from 'next/server'

import { ipAddress } from '@vercel/functions'

import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { auth } from 'src/auth'
import { Stringified, parse } from 'src/utils/superjson'
import { TrackableEvents } from './events'
import { ip, token, trackingEnabled } from './utils'

type SystemEventProperties = {
  $browser?: string
  $device?: string
  $device_id?: string
  $os?: string
  $referrer?: string | null
  ip?: string | null
  time?: number
}

type CommonEventProperties = {
  'Tracked from (path)'?: string
  'Tracked from (route)'?: string
  userId?: string
  $referrer?: string
}

const BAF_SESSION_ID = 'baf-session-id'

export async function track<T extends keyof TrackableEvents>(
  event: T,
  stringifedProperties:
    | (TrackableEvents[T] & CommonEventProperties)
    | Stringified<TrackableEvents[T] & CommonEventProperties>,
  req?: NextRequest,
  res?: NextResponse
) {
  const { userId: clientUserId, ...properties } =
    typeof stringifedProperties === 'string'
      ? parse(stringifedProperties)
      : stringifedProperties

  if (!trackingEnabled) {
    console.debug(`Tracking Event: ${event}`, properties)
    return
  }
  if (!token) return

  const userId = clientUserId || (await auth())?.user?.id

  // If a user is anonymous, we generate a session ID and track it as the device ID.
  // If a user is logged in, we do not send a device ID and instead send a user ID.
  // If a user is anonymous and then logs in, we send both to link the anonymous session
  // to the user.

  const sessionId =
    (await getSessionId(req?.cookies)) ||
    (userId ? undefined : await generateAnonymousId(res?.cookies))

  const body = {
    event,
    properties: {
      ...(await getCommonProperties(req)),
      ...properties,
      $device_id: sessionId,
      $user_id: userId,
      token
    }
  }

  await fetch(`https://api.mixpanel.com/track?ip=0`, {
    method: 'POST',
    body: JSON.stringify([body]),
    headers: { 'content-type': 'application/json', accept: 'text/plain' }
  })

  // If we have both a session ID and a user ID, it means we've just linked an anonymous
  // session to a user. We should clear the session ID cookie.

  if (userId && sessionId && sessionId !== userId)
    await clearSessionId(req?.cookies)
}

async function getCommonProperties(
  req?: NextRequest
): Promise<SystemEventProperties> {
  try {
    const h = req?.headers || (await headers())
    const ua = userAgent({ headers: h })

    return {
      $browser: ua.browser.name,
      $device: ua.device.type,
      $os: ua.os.name,
      $referrer: h.get('referer'),
      ip: ip(h, ipAddress(req as Request)),
      time: Date.now()
    }
  } catch {
    return {}
  }
}

async function generateAnonymousId(c?: Pick<ResponseCookies, 'set'>) {
  const anonId = crypto.randomUUID()
  const cookieStore = c || (await cookies())
  cookieStore.set({
    name: BAF_SESSION_ID,
    value: anonId,
    maxAge: 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'lax'
  })
  return anonId
}

async function getSessionId(c?: Pick<ReadonlyRequestCookies, 'get'>) {
  const cookieStore = c || (await cookies())
  return cookieStore.get(BAF_SESSION_ID)?.value
}

async function clearSessionId(c?: { delete(name: string): void }) {
  console.log('== clearing session')
  const cookieStore = c || (await cookies())
  return cookieStore.delete(BAF_SESSION_ID)
}
