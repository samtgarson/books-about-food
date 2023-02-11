import { Book } from './book'
import { Image } from './image'
import { Publisher } from './publisher'
import { FullBookAttrs } from './types'

export class FullBook extends Book {
  previewImages: Image[]
  tags: string[]
  publisher: Publisher

  constructor(attrs: FullBookAttrs) {
    super(attrs)
    this.previewImages = attrs.previewImages.map(
      (image) => new Image(image, `Preview for ${attrs.title}`)
    )
    this.tags = attrs.tags.map((tag) => tag.name)
    this.publisher = new Publisher(attrs.publisher)
  }
}
