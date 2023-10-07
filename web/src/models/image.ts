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
    { path, width, height, caption, placeholderUrl, id }: Pick<Prisma.Image, 'path' | 'width' | 'height' | 'caption' | 'placeholderUrl' | 'id'>,
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
    const attrs: Omit<ImageProps, 'width' | 'height'> & {
      width?: number
      height?: number
    } = {
      src: this.src,
      alt: this.caption
    }

    if (height) {
      attrs.width = this.widthFor(height)
      attrs.height = height
    }

    if (
      (!attrs.width || attrs.width > 40) &&
      (!attrs.height || attrs.height > 40)
    ) {
      attrs.placeholder = this.placeholderUrl ? 'blur' : undefined
      attrs.blurDataURL = this.placeholderUrl
    }

    return { ...attrs, fill: !attrs.width }
  }
}
