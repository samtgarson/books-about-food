import { getPlaiceholder } from 'plaiceholder'

export type ImageBlurrerOptions = { url: string } | { s3path: string }

const s3Domain = process.env.S3_DOMAIN as string

export class ImageBlurrer {
  private url: string

  constructor(options: ImageBlurrerOptions) {
    if ('url' in options) {
      this.url = options.url
    } else {
      this.url = new URL(options.s3path, s3Domain).toString()
    }
  }

  async call() {
    const { base64 } = await getPlaiceholder(this.url)
    return base64
  }
}
