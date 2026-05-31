import { getPayloadAuth } from 'payload-auth/better-auth/plugin'
import payloadConfig from 'src/payload.config'

// Lazily initialise Payload + Better Auth. Connecting to the database must
// happen inside a request handler — Cloudflare Workers forbid asynchronous
// I/O during global (module-evaluation) scope. A module-level
// `await getPayloadAuth(...)` crashes the Worker on startup. Caching the
// promise dedupes concurrent initialisation.
let cached: ReturnType<typeof getPayloadAuth> | null = null

export async function getAuth() {
  if (!cached) cached = getPayloadAuth(payloadConfig)
  const payload = await cached
  return payload.betterAuth
}

export type Auth = Awaited<ReturnType<typeof getAuth>>
