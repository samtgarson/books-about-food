import * as Prisma from '@books-about-food/database'
import { imageUrl } from '@books-about-food/shared/utils/image-url'
import { ImageProps } from 'next/image'

export class Image {
  id: string
  path: string
  width: number
  height: number
  caption: string
  placeholderUrl?: string

  constructor(
    {
      path,
      width,
      height,
      caption,
      placeholderUrl,
      id
    }: Pick<
      Prisma.Image,
      'path' | 'width' | 'height' | 'caption' | 'placeholderUrl' | 'id'
    >,
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
