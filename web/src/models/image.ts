import * as Prisma from 'database'
import { ImageProps } from 'next/image'

export class Image {
  url: string
  width: number
  height: number
  caption: string
  placeholderUrl?: string

  constructor(
    { url, width, height, caption, placeholderUrl }: Prisma.Image,
    defaultCaption: string
  ) {
    this.url = url
    this.width = width
    this.height = height
    this.caption = caption || defaultCaption
    this.placeholderUrl = placeholderUrl ?? undefined
  }

  get src() {
    return new URL(this.url, process.env.NEXT_PUBLIC_S3_DOMAIN).toString()
  }

  widthFor(height: number) {
    return Math.floor((height / this.height) * this.width)
  }

  imageAttrs(height?: number): ImageProps {
    const attrs = {
      src: this.src,
      alt: this.caption,
      placeholder: this.placeholderUrl ? 'blur' : undefined,
      blurDataURL: this.placeholderUrl
    } satisfies ImageProps

    if (height) {
      return {
        width: this.widthFor(height),
        height,
        ...attrs
      }
    }

    return attrs
  }
}
