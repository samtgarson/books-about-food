import { kv } from '@vercel/kv'
import { deserialize } from 'superjson'
import { SuperJSONResult } from 'superjson/dist/types'
import { stringify } from './superjson'

const CACHE_VERSION = 'v1'

export async function getOrPopulateKv<R>(
  keys: string[],
  exec: () => Promise<R>,
  {
    expiry = 60 * 10,
    enabled = true,
    skipResult
  }: {
    expiry?: number
    enabled?: boolean
    skipResult?: (data: R) => boolean
  } = {}
) {
  if (!enabled) return exec()

  const key = ['baf', CACHE_VERSION, ...keys].join(':')
  const cached = await kv.get<SuperJSONResult>(key)
  if (cached) {
    console.log('Cache hit:', key)
    try {
      return deserialize(cached) as R
    } catch (e) {
      console.error('Failed to parse cache:', e)
    }
  }

  console.log('Cache miss:', key)
  const data = await exec()
  if (!data) return data
  if (skipResult?.(data)) return data
  const stringified = stringify(data)
  await kv.set(key, stringified, { ex: expiry })
  return data
}
