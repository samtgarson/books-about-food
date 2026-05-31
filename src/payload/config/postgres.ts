import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname =
  typeof import.meta.url === 'string' && import.meta.url.startsWith('file:')
    ? path.dirname(fileURLToPath(import.meta.url))
    : '.'

export const postgres = postgresAdapter({
  idType: 'uuid',
  schemaName: 'payload',
  push: false,
  pool: {
    connectionString: process.env.DATABASE_URL,
    // Cloudflare Workers forbid sharing I/O (TCP connections) across requests.
    // maxUses: 1 discards each connection after a single use so a connection
    // opened in one request is never reused by another. See:
    // https://blog.cloudflare.com/payload-cms-workers/
    maxUses: 1
  },
  migrationDir: path.resolve(dirname, '..', 'migrations'),
  generateSchemaOutputFile: path.resolve(dirname, '..', 'schema.ts')
})
