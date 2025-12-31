import { postgresAdapter } from '@payloadcms/db-postgres'
import type { GenerateFileURL } from '@payloadcms/plugin-cloud-storage/types'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { imageUrl } from '@books-about-food/shared/utils/image-url'
import { BookVotes } from './payload/collections/book-votes'
import { Books } from './payload/collections/books'
import { Claims } from './payload/collections/claims'
import { Collections } from './payload/collections/collections'
import { Contributions } from './payload/collections/contributions'
import { FAQs } from './payload/collections/faqs'
import { Favourites } from './payload/collections/favourites'
import { FeaturedProfiles } from './payload/collections/featured-profiles'
import { Features } from './payload/collections/features'
import { Images } from './payload/collections/images'
import { Jobs } from './payload/collections/jobs'
import { Locations } from './payload/collections/locations'
import { Memberships } from './payload/collections/memberships'
import { Pitches } from './payload/collections/pitches'
import { Posts } from './payload/collections/posts'
import { Profiles } from './payload/collections/profiles'
import { PublisherInvitations } from './payload/collections/publisher-invitations'
import { Publishers } from './payload/collections/publishers'
import { TagGroups } from './payload/collections/tag-groups'
import { Tags } from './payload/collections/tags'
import { Users } from './payload/collections/users'
import { cacheRevalidationPlugin } from './payload/plugins/cache-revalidation'

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
    BookVotes,
    Books,
    Claims,
    Collections,
    Contributions,
    FAQs,
    Favourites,
    FeaturedProfiles,
    Features,
    Images,
    Jobs,
    Locations,
    Memberships,
    Pitches,
    Posts,
    Profiles,
    PublisherInvitations,
    Publishers,
    TagGroups,
    Tags,
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
  }),
  upload: {},
  sharp,
  plugins: [
    cacheRevalidationPlugin(),
    s3Storage({
      acl: 'private',
      collections: {
        images: {
          disablePayloadAccessControl: true,
          prefix: 'payload',
          generateFileURL({
            filename,
            prefix
          }: Parameters<GenerateFileURL>[0]) {
            return imageUrl(filename, prefix)
          }
        }
      },
      bucket: process.env.AWS_S3_BUCKET || '',
      config: {
        endpoint: process.env.AWS_S3_ENDPOINT,
        region: process.env.AWS_REGION || 'auto',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
        },
        forcePathStyle: true
      }
    })
  ]
})
