import { Link } from '@books-about-food/database'
import { Book } from './book'
import { Image } from './image'
import { Publisher } from './publisher'
import { FullBookAttrs } from './types'

export class FullBook extends Book {
  previewImages: Image[]
  tags: string[]
  publisher?: Publisher
  links: Link[]

  constructor(attrs: FullBookAttrs) {
    super(attrs)
    this.previewImages = attrs.previewImages.map(
      (image, i) => new Image(image, `Preview ${i} for ${attrs.title}`)
    )
    this.tags = attrs.tags.map((tag) => tag.name)
    this.publisher = attrs.publisher
      ? new Publisher(attrs.publisher)
      : undefined
    this.links = attrs.links
  }
}
