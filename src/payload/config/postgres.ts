import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const postgres = postgresAdapter({
  idType: 'uuid',
  schemaName: 'payload',
  // Push schema in development (Payload dev workflow), but never during
  // `next build` / production — otherwise the build runs a drizzle push and
  // hangs on an interactive data-loss prompt. Production uses migrations.
  push: true,
  pool: {
    connectionString: process.env.DATABASE_URL
  },
  migrationDir: path.resolve(dirname, '..', 'migrations'),
  generateSchemaOutputFile: path.resolve(dirname, '..', 'schema.ts')
})
