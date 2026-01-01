import { imageUrl } from '@books-about-food/shared/utils/image-url'
import type { GenerateFileURL } from '@payloadcms/plugin-cloud-storage/types'
import { s3Storage as s3StoragePlugin } from '@payloadcms/storage-s3'

export const s3Storage = s3StoragePlugin({
  acl: 'private',
  collections: {
    images: {
      disablePayloadAccessControl: true,
      prefix: 'payload',
      generateFileURL({ filename, prefix }: Parameters<GenerateFileURL>[0]) {
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
