import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'
import { fileURLToPath } from 'url'
import { migrations } from '../migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const postgres = postgresAdapter({
  idType: 'uuid',
  schemaName: 'payload',
  // Push schema in development (Payload dev workflow), but never during
  // `next build` / production — otherwise the build runs a drizzle push and
  // hangs on an interactive data-loss prompt. Production uses migrations.
  push: true,
  // Bundled (statically imported) migrations, run automatically on `connect()`
  // when NODE_ENV=production. This avoids the `payload migrate` CLI dynamically
  // importing `.ts` migration files in an ESM loader worker without the tsx
  // loader (fails on Node < ~22.18; Railway's Nixpacks ships 22.14).
  prodMigrations: migrations,
  pool: {
    connectionString: process.env.DATABASE_URL
  },
  migrationDir: path.resolve(dirname, '..', 'migrations'),
  generateSchemaOutputFile: path.resolve(dirname, '..', 'schema.ts')
})
