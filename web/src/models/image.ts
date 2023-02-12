import * as Prisma from 'database'
import { ImageProps } from 'next/image'

export class Image {
  id: string
  path: string
  width: number
  height: number
  caption: string
  placeholderUrl?: string

  constructor(
    { path, width, height, caption, placeholderUrl, id }: Prisma.Image,
    defaultCaption: string
  ) {
    this.id = id
    this.path = path
    this.width = width
    this.height = height
    this.caption = caption || defaultCaption
    this.placeholderUrl = placeholderUrl ?? undefined
  }

  get src() {
    return new URL(this.path, process.env.NEXT_PUBLIC_S3_DOMAIN).toString()
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

    return { ...attrs, fill: true }
  }
}
