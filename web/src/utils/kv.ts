import { kv } from '@vercel/kv'

export async function getOrPopulateKv<R>(
  keys: string[],
  exec: () => Promise<R>,
  {
    expiry = 60 * 10,
    enabled = true
  }: { expiry?: number; enabled?: boolean } = {}
) {
  if (!enabled) return exec()

  const key = ['baf', ...keys].join(':')
  const cached = await kv.get<R>(key)
  if (cached) console.log('Cache hit:', key)
  else console.log('Cache miss:', key)
  if (cached) return cached

  const data = await exec()
  if (!data) return data
  await kv.set(key, data, { ex: expiry })
  return data
}
