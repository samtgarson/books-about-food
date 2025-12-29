import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Books } from './payload/collections/books'
import { Claims } from './payload/collections/claims'
import { Collections } from './payload/collections/collections'
import { Contributions } from './payload/collections/contributions'
import { FAQs } from './payload/collections/faqs'
import { FeaturedProfiles } from './payload/collections/featured-profiles'
import { Features } from './payload/collections/features'
import { Images } from './payload/collections/images'
import { Jobs } from './payload/collections/jobs'
import { Links } from './payload/collections/links'
import { Locations } from './payload/collections/locations'
import { Profiles } from './payload/collections/profiles'
import { Publishers } from './payload/collections/publishers'
import { TagGroups } from './payload/collections/tag-groups'
import { Tags } from './payload/collections/tags'
import { Users } from './payload/collections/users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname)
    }
  },
  collections: [
    // Core content
    Books,
    Profiles,
    Publishers,

    // Relationships
    Contributions,
    Images,
    Links,

    // Categorization
    Tags,
    TagGroups,
    Collections,

    // Features
    Features,
    FeaturedProfiles,
    Claims,
    Locations,

    // Reference
    Jobs,
    FAQs,

    // Auth (must be last as it's the admin user collection)
    Users
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'payload-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload', 'payload-types.ts')
  },
  db: postgresAdapter({
    idType: 'uuid',
    schemaName: 'payload',
    pool: {
      connectionString: process.env.DATABASE_URL
    },
    migrationDir: path.resolve(dirname, 'payload', 'migrations')
  })
})
