import { Redis } from '@upstash/redis'
import { deserialize, SuperJSONResult } from 'superjson'
import { stringify } from './superjson'

const CACHE_VERSION = 'v1'
const ROOT_SKIP = !!process.env.SKIP_REDIS_CACHE
const REDIS_AVAILABLE =
  !!process.env.UPSTASH_REDIS_URL && !!process.env.UPSTASH_REDIS_TOKEN

let redis: Redis | null = null
function getRedis() {
  if (!REDIS_AVAILABLE) return null
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL!,
      token: process.env.UPSTASH_REDIS_TOKEN!,
      cache: 'default',
      enableAutoPipelining: true
    })
  }
  return redis
}

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
): Promise<R> {
  const client = getRedis()
  if (!enabled || ROOT_SKIP || !client) return exec()

  const key = ['baf', CACHE_VERSION, ...keys].join(':')
  try {
    const cached = await client.get<SuperJSONResult>(key)
    if (cached) {
      return deserialize(cached)
    }
  } catch (e) {
    console.error('Failed to get cache:', e)
  }

  const data = await exec()
  if (!data) return data
  if (skipResult?.(data)) return data
  const stringified = stringify(data)
  try {
    await client.set(key, stringified, { ex: expiry })
  } catch (e) {
    console.error('Failed to set cache:', e)
  }
  return data
}
