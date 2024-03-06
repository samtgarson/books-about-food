import * as Prisma from '@books-about-food/database'
import { imageUrl } from '@books-about-food/shared/utils/image-url'
import { ImageProps } from 'next/image'
import { cloudflareLoader } from '../utils/image-loader'

export class Image {
  id: string
  path: string
  width: number
  height: number
  caption: string
  placeholderUrl?: string
  order: number

  constructor(
    attrs: Pick<
      Prisma.Image,
      | 'path'
      | 'width'
      | 'height'
      | 'caption'
      | 'placeholderUrl'
      | 'id'
      | 'order'
    >,
    defaultCaption: string,
    private optimized = false
  ) {
    this.id = attrs.id
    this.path = attrs.path
    this.width = attrs.width
    this.height = attrs.height
    this.caption = attrs.caption || defaultCaption
    this.placeholderUrl = attrs.placeholderUrl ?? undefined
    this.order = attrs.order
  }

  get src() {
    return imageUrl(this.path)
  }

  widthFor(height: number) {
    return Math.floor((height / this.height) * this.width)
  }

  imageAttrs(height?: number): ImageProps {
    const attrs: Omit<ImageProps, 'width' | 'height'> & {
      width?: number
      height?: number
    } = {
      src: this.optimized ? cloudflareLoader(this.path, height) : this.src,
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
