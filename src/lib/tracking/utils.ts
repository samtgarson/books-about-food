import { headers } from 'next/headers'

export const trackingEnabled =
  process.env.NODE_ENV !== 'development' ||
  process.env.ENABLE_TRACKING_IN_DEV === 'true'

export const token = process.env.MIXPANEL_TOKEN

export function ip(h: Awaited<ReturnType<typeof headers>>, ip?: string) {
  if (ip) return ip
  const cf = h.get('cf-connecting-ip')
  if (cf) return cf

  const forwardedFor = h.get('x-forwarded-for')
  if (typeof forwardedFor === 'string') return forwardedFor.split(',')[0]

  return h.get('x-real-ip') || '0'
}
