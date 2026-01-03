import { imageUrl } from '@books-about-food/shared/utils/image-url'
import { ImageProps } from 'next/image'
import type { Image as PayloadImage } from 'src/payload/payload-types'

export class Image {
  id: string
  path: string
  width: number
  height: number
  caption: string
  placeholderUrl?: string

  constructor(
    attrs: PayloadImage,
    caption: string,
    private optimized = false
  ) {
    this.id = attrs.id
    this.path = attrs.url ?? `${attrs.prefix ?? ''}/${attrs.filename ?? ''}`
    this.width = attrs.width ?? 0
    this.height = attrs.height ?? 0
    this.caption = caption
    this.placeholderUrl = attrs.placeholderUrl ?? undefined
  }

  get src() {
    return imageUrl(this.path)
  }

  widthFor(height: number) {
    return Math.floor((height / this.height) * this.width)
  }

  imageAttrs(height?: number): ImageProps {
    const attrs: Pick<
      ImageProps,
      'src' | 'alt' | 'unoptimized' | 'placeholder' | 'blurDataURL'
    > & {
      width?: number
      height?: number
    } = {
      src: this.src,
      alt: this.caption,
      unoptimized: !this.optimized
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
