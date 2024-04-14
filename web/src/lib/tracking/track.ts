'use server'

import { cookies, headers } from 'next/headers'
import { NextRequest, NextResponse, userAgent } from 'next/server'

import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { auth } from 'src/auth'
import { TrackableEvents } from './events'
import { ip, token, trackingEnabled } from './utils'

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
  event: T,
  properties: TrackableEvents[T] & { userId?: string },
  req?: NextRequest,
  res?: NextResponse
) {
  if (!trackingEnabled) {
    console.debug(`Tracking Event: ${event}`, properties)
    return
  }
  if (!token) return

  const userId = properties.userId || (await auth())?.user?.id

  const sessionId =
    getSessionId(req?.cookies) ||
    (userId ? undefined : generateAnonymousId(res?.cookies))
  const body = {
    event,
    properties: {
      ...getCommonProperties(req),
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

  if (userId && sessionId && sessionId !== userId) clearSessionId(req?.cookies)
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
      ip: ip(req?.ip, h)
    }
  } catch (e) {
    return {}
  }
}

function generateAnonymousId(c: Pick<ResponseCookies, 'set'> = cookies()) {
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

function getSessionId(c: Pick<ReadonlyRequestCookies, 'get'> = cookies()) {
  return c.get(BAF_SESSION_ID)?.value
}

function clearSessionId(c: { delete(name: string): void } = cookies()) {
  console.log('== clearing session')
  return c.delete(BAF_SESSION_ID)
}
