import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'
import { fileURLToPath } from 'url'
import { migrations } from '../migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const postgres = postgresAdapter({
  idType: 'uuid',
  schemaName: 'payload',
  push: true,
  // Bundled migrations run on connect(); the payload-migrate CLI can't load .ts here.
  prodMigrations: migrations,
  pool: {
    connectionString: process.env.DATABASE_URL,
    // Cap the pool during build so prerender workers don't exhaust connections.
    max: process.env.DB_POOL_MAX ? Number(process.env.DB_POOL_MAX) : undefined
  },
  migrationDir: path.resolve(dirname, '..', 'migrations'),
  generateSchemaOutputFile: path.resolve(dirname, '..', 'schema.ts')
})
