// Shim that re-exports @neondatabase/serverless as a default export
// to match the `import pg from "pg"` pattern used by drizzle-orm and Payload.
import * as neon from '@neondatabase/serverless'

export const {
  Pool,
  Client,
  Query,
  defaults,
  types,
  DatabaseError,
  Connection
} = neon

export default neon
