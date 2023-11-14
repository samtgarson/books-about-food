import { Schema } from '.schema/types'
import { getEnv } from '@books-about-food/shared/utils/get-env'
import { createAgent } from '@forestadmin/agent'
import { datasource } from 'lib/utils/data-source'
import { resolve } from 'path'
import pkgDir from 'pkg-dir'
import { customiseBooks } from './collections/books'
import { customiseClaims } from './collections/claims'
import { customiseContributions } from './collections/contributions'
import { customiseImages } from './collections/images'
import { customiseJobs } from './collections/jobs'
import { customiseLinks } from './collections/links'
import { customiseProfiles } from './collections/profiles'
import { customisePublishers } from './collections/publishers'

const rootDir = pkgDir.sync(__dirname)
if (!rootDir) {
  throw new Error('Cannot find directory for schema')
}

export const agent = createAgent<Schema>({
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
  .customizeCollection('profiles', customiseProfiles)
  .customizeCollection('jobs', customiseJobs)
  .customizeCollection('images', customiseImages)
  .customizeCollection('links', customiseLinks)
  .customizeCollection('claims', customiseClaims)
  .start()
