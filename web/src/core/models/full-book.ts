import type {
  BookLinks,
  Book as PayloadBook,
  Publisher as PayloadPublisher
} from 'src/payload/payload-types'
import { Book } from './book'
import { Image } from './image'
import { Publisher } from './publisher'
import {
  optionalPopulated,
  requirePopulatedArray
} from './utils/payload-validation'

export class FullBook extends Book {
  previewImages: Image[]
  tags: Array<{ slug: string; name: string }>
  publisher?: Publisher
  links: NonNullable<BookLinks>

  constructor(attrs: PayloadBook) {
    super(attrs)

    // Validate previewImages array images are populated
    const previewImages = requirePopulatedArray(
      attrs.previewImages?.map((p) => p.image),
      'FullBook.previewImages'
    )

    // Validate relationships are populated
    const tags = requirePopulatedArray(attrs.tags, 'FullBook.tags')
    const publisher = optionalPopulated<PayloadPublisher>(
      attrs.publisher,
      'FullBook.publisher'
    )

    this.previewImages = previewImages.map(
      (preview, i) =>
        new Image(preview, `Preview ${i} for ${attrs.title}`, true)
    )
    this.tags = tags.map((tag) => ({ slug: tag.slug, name: tag.name }))
    this.publisher = publisher ? new Publisher(publisher) : undefined
    this.links = attrs.links ?? []
  }

  get tagNames() {
    return this.tags.map((tag) => tag.name)
  }
}
