import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const postgres = postgresAdapter({
  idType: 'uuid',
  schemaName: 'payload',
  // Use migrations, not dev schema-push. Without this, `next build` runs a
  // drizzle push against the DB and prompts interactively on schema drift.
  push: false,
  pool: {
    connectionString: process.env.DATABASE_URL
  },
  migrationDir: path.resolve(dirname, '..', 'migrations'),
  generateSchemaOutputFile: path.resolve(dirname, '..', 'schema.ts')
})
