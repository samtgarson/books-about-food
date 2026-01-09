import { Book } from './book'
import { Image } from './image'
import { Publisher } from './publisher'
import type {
  BookLink,
  BookLinks,
  Book as PayloadBook,
  Publisher as PayloadPublisher
} from './types'
import {
  optionalPopulated,
  requirePopulatedArray
} from './utils/payload-validation'

export class FullBook extends Book {
  previewImages: Image[]
  tags: Array<{ slug: string; name: string }>
  publisher?: Publisher
  links: NonNullable<BookLink[]>

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
    this.publisher = publisher ? Publisher.slim(publisher) : undefined
    this.links = (attrs.links ?? []).map(this.transformLink)
  }

  get tagNames() {
    return this.tags.map((tag) => tag.name)
  }

  private transformLink(
    this: void,
    link: NonNullable<BookLinks>[number]
  ): BookLink {
    return {
      id: link.id!,
      url: link.url,
      site:
        link.site === 'Other' && link['site (other)']
          ? link['site (other)']
          : link.site
    }
  }
}
