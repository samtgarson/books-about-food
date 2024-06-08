import { Redis } from '@upstash/redis'
import { deserialize } from 'superjson'
import { SuperJSONResult } from 'superjson/dist/types'
import { stringify } from './superjson'

const CACHE_VERSION = 'v1'
const ROOT_SKIP = !!process.env.SKIP_REDIS_CACHE

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
  cache: 'default',
  enableAutoPipelining: true
})

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
  if (!enabled || ROOT_SKIP) return exec()

  const key = ['baf', CACHE_VERSION, ...keys].join(':')
  try {
    const cached = await redis.get<SuperJSONResult>(key)
    if (cached) {
      console.log('Cache hit:', key)
      return deserialize(cached) as R
    }
  } catch (e) {
    console.error('Failed to get cache:', e)
  }

  console.log('Cache miss:', key)
  const data = await exec()
  if (!data) return data
  if (skipResult?.(data)) return data
  const stringified = stringify(data)
  try {
    await redis.set(key, stringified, { ex: expiry })
  } catch (e) {
    console.error('Failed to set cache:', e)
  }
  return data
}
