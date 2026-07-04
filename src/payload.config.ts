import { payloadCmdk } from '@veiag/payload-cmdk'
import path from 'path'
import { buildConfig } from 'payload'
import { betterAuthPlugin } from 'payload-auth/better-auth/plugin'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { betterAuthPluginOptions } from './lib/auth/options'

import { collections } from './payload/collections'
import { postgres } from './payload/config/postgres'
import { s3Storage } from './payload/config/s3-storage'
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
  collections,
  secret: process.env.PAYLOAD_SECRET || 'payload-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload', 'payload-types.ts')
  },
  db: postgres,
  upload: {},
  sharp,
  plugins: [
    betterAuthPlugin(betterAuthPluginOptions),
    s3Storage,
    cacheRevalidationPlugin(),
    payloadCmdk({})
  ]
})
