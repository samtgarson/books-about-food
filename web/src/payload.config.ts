import path from 'path'
import { buildConfig } from 'payload'
import { authjsPlugin } from 'payload-authjs'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { authConfig } from './utils/auth-config'

import { collections } from './payload/collections'
import { editor } from './payload/config/editor'
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
  editor,
  secret: process.env.PAYLOAD_SECRET || 'payload-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload', 'payload-types.ts')
  },
  db: postgres,
  upload: {},
  sharp,
  plugins: [
    authjsPlugin({
      authjsConfig: authConfig
    }),
    s3Storage,
    cacheRevalidationPlugin()
  ]
})
