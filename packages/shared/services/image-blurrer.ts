import { getPlaiceholder } from 'plaiceholder'
import { imageUrl } from '../utils/image-url'

export type ImageBlurrerOptions = { url: string } | { s3path: string }

export class ImageBlurrer {
  private url: string

  constructor(options: ImageBlurrerOptions) {
    if ('url' in options) {
      this.url = options.url
    } else {
      this.url = imageUrl(options.s3path)
    }
  }

  async call() {
    const { base64 } = await getPlaiceholder(this.url)
    return base64
  }
}
