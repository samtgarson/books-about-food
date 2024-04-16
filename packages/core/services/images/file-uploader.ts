import { getEnv } from '@books-about-food/shared/utils/get-env'
import { S3 } from 'aws-sdk'
import Mime from 'mime/lite'

const defaultClient = new S3({
  endpoint: getEnv('AWS_S3_ENDPOINT'),
  region: process.env.AWS_REGION || 'auto',
  signatureVersion: 'v4',
  credentials: {
    accessKeyId: getEnv('AWS_ACCESS_KEY_ID'),
    secretAccessKey: getEnv('AWS_SECRET_ACCESS_KEY')
  }
})

export class FileUploader {
  constructor(
    private client: S3 = defaultClient,
    private bucket: string = getEnv('AWS_S3_BUCKET')
  ) {}

  async upload(contents: Buffer, mimeType: string, path: string) {
    const ext = Mime.extension(mimeType)
    if (!ext) {
      throw new Error('Unknown file type')
    }
    const name = crypto.randomUUID()
    const Key = `${path}/${name}.${ext}`

    await this.client
      .upload({
        Bucket: this.bucket,
        Key,
        Body: contents,
        ContentType: mimeType,
        ACL: 'private',
        CacheControl: 'public,max-age=31536000,immutable'
      })
      .promise()

    return { path: Key, id: name }
  }

  async delete(path: string) {
    await this.client
      .deleteObject({
        Bucket: this.bucket,
        Key: path
      })
      .promise()
  }
}
