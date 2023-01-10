import * as Prisma from 'database'

export class Image {
  url: string
  width: number
  height: number
  caption: string

  constructor(
    { url, width, height, caption }: Prisma.Image,
    defaultCaption: string
  ) {
    this.url = url
    this.width = width
    this.height = height
    this.caption = caption || defaultCaption
  }

  get src() {
    return new URL(this.url, process.env.NEXT_PUBLIC_S3_DOMAIN).toString()
  }

  widthFor(height: number) {
    return Math.floor((height / this.height) * this.width)
  }
}
