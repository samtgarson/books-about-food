import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { getEnv } from '@books-about-food/shared/utils/get-env'
import { extension } from 'mime-types'

const defaultClient = new S3Client({
  endpoint: getEnv('AWS_S3_ENDPOINT'),
  region: process.env.AWS_REGION || 'auto',
  credentials: {
    accessKeyId: getEnv('AWS_ACCESS_KEY_ID'),
    secretAccessKey: getEnv('AWS_SECRET_ACCESS_KEY')
  }
})

export class FileUploader {
  constructor(
    private client: S3Client = defaultClient,
    private bucket: string = getEnv('AWS_S3_BUCKET')
  ) {}

  async upload(contents: Buffer, mimeType: string, path: string) {
    const ext = extension(mimeType)
    if (!ext) {
      throw new Error('Unknown file type')
    }
    const name = crypto.randomUUID()
    const Key = `${path}/${name}.${ext}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key,
        Body: contents,
        ContentType: mimeType,
        ACL: 'private',
        CacheControl: 'public,max-age=31536000,immutable'
      })
    )

    return { path: Key, id: name }
  }

  async delete(path: string) {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: path
      })
    )
  }
}
