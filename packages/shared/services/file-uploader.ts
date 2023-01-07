import { S3 } from 'aws-sdk'
import { extension } from 'mime-types'
import { getEnv } from '../utils/get-env'
import { v4 as uuid } from 'uuid'

const defaultClient = new S3({
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
    const ext = extension(mimeType)
    if (!ext) {
      throw new Error('Unknown file type')
    }
    const name = uuid()
    const Key = `${path}/${name}.${ext}`

    await this.client
      .upload({
        Bucket: this.bucket,
        Key,
        Body: contents,
        ContentType: mimeType,
        ACL: 'private'
      })
      .promise()

    return Key
  }
}
