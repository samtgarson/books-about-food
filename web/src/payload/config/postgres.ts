import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

console.log('PostgreSQL adapter configuration:', process.env.DATABASE_URL)
export const postgres = postgresAdapter({
  idType: 'uuid',
  schemaName: 'payload',
  pool: {
    connectionString: process.env.DATABASE_URL
  },
  migrationDir: path.resolve(dirname, '..', 'migrations'),
  generateSchemaOutputFile: path.resolve(dirname, '..', 'schema.ts')
})
