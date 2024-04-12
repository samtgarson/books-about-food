'use server'

import { cookies, headers } from 'next/headers'
import { NextRequest, NextResponse, userAgent } from 'next/server'

import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies'
import { TrackableEvents } from './events'
import { token, trackingEnabled } from './utils'

type CommonEventProperties = {
  $browser?: string
  $device?: string
  $device_id?: string
  $os?: string
  $referrer?: string | null
  ip?: string | null
}

const BAF_SESSION_ID = 'baf-session-id'

export async function track<T extends keyof TrackableEvents>(
  userId: string | undefined,
  event: T,
  properties: TrackableEvents[T],
  req?: NextRequest,
  res?: NextResponse
) {
  if (!trackingEnabled) return
  if (!token) return

  const distinct_id =
    userId || getSessionId(req) || generateAnonymousId(res?.cookies)

  const body = {
    event,
    properties: {
      ...getCommonProperties(req),
      ...properties,
      distinct_id,
      token
    }
  }

  await fetch(`https://api.mixpanel.com/track?ip=0`, {
    method: 'POST',
    body: JSON.stringify([body]),
    headers: { 'content-type': 'application/json', accept: 'text/plain' }
  })

  if (userId && distinct_id !== userId) clearSessionId(req)
}

function getCommonProperties(req?: NextRequest): CommonEventProperties {
  try {
    const h = req?.headers || headers()
    const ua = userAgent({ headers: h })

    return {
      $browser: ua.browser.name,
      $device: ua.device.type,
      $os: ua.os.name,
      $referrer: h.get('referer'),
      $device_id: getSessionId(req),
      ip:
        h.get('cf-connecting-ip') ||
        req?.ip ||
        h.get('x-real-ip') ||
        h.get('x-forwarded-for')
    }
  } catch (e) {
    return {}
  }
}

function generateAnonymousId(c: ResponseCookies = cookies()) {
  const anonId = crypto.randomUUID()
  c.set({
    name: 'baf-session-id',
    value: anonId,
    maxAge: 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true
  })
  return anonId
}

function getSessionId(req?: NextRequest) {
  if (req) return req?.cookies.get(BAF_SESSION_ID)?.value
  return cookies().get(BAF_SESSION_ID)?.value
}

function clearSessionId(req?: NextRequest) {
  if (req) return req?.cookies.delete(BAF_SESSION_ID)
  return cookies().delete(BAF_SESSION_ID)
}
