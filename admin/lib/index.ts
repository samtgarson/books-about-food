import { Schema } from '.schema/types'
import { createAgent } from '@forestadmin/agent'
import { datasource } from 'lib/utils/data-source'
import { resolve } from 'path'
import pkgDir from 'pkg-dir'
import { getEnv } from 'shared'
import { customiseBooks } from './collections/books'
import { customiseContributions } from './collections/contributions'
import { customisePublishers } from './collections/publishers'

const rootDir = pkgDir.sync(__dirname)
if (!rootDir) {
  throw new Error('Cannot find directory for schema')
}

const agent = createAgent<Schema>({
  authSecret: getEnv('FOREST_AUTH_SECRET'),
  envSecret: getEnv('FOREST_ENV_SECRET'),
  isProduction: process.env.NODE_ENV === 'production',
  schemaPath: resolve(rootDir, '.schema', 'forestadmin-schema.json'),
  typingsPath: resolve(rootDir, '.schema', 'types.ts'),
  typingsMaxDepth: 5
})

agent
  .addDataSource(datasource)
  .customizeCollection('books', customiseBooks)
  .customizeCollection('publishers', customisePublishers)
  .customizeCollection('contributions', customiseContributions)
  .start()

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001
agent.mountOnStandaloneServer(port)
