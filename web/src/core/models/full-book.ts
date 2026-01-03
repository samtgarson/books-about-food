import type {
  BookLinks,
  Book as PayloadBook,
  Image as PayloadImage,
  Publisher as PayloadPublisher
} from 'src/payload/payload-types'
import { Book } from './book'
import { Image } from './image'
import { Publisher } from './publisher'
import {
  optionalPopulated,
  requirePopulatedArray
} from './utils/payload-validation'

type FullBookAttrs = PayloadBook & {
  previewImages?: Array<{
    image: PayloadImage
    id?: string | null
  }>
  tags?: Array<{
    id: string
    name: string
    slug: string
  }>
  publisher?: PayloadPublisher
  links?: NonNullable<PayloadBook['links']>
}

export class FullBook extends Book {
  previewImages: Image[]
  tags: Array<{ slug: string; name: string }>
  publisher?: Publisher
  links: NonNullable<BookLinks>

  constructor(attrs: FullBookAttrs) {
    super(attrs)

    // Validate previewImages array images are populated
    if (attrs.previewImages?.some((p) => typeof p.image === 'string')) {
      throw new Error(
        'FullBook.previewImages must be populated (string IDs received). Ensure sufficient depth when querying.'
      )
    }

    // Validate relationships are populated
    const tags = requirePopulatedArray(attrs.tags, 'FullBook.tags')
    const publisher = optionalPopulated<PayloadPublisher>(
      attrs.publisher,
      'FullBook.publisher'
    )

    this.previewImages = (attrs.previewImages ?? [])
      .filter(
        (p): p is Exclude<typeof p, { image: string }> =>
          typeof p.image !== 'string'
      )
      .map(
        (preview, i) =>
          new Image(
            preview.image as PayloadImage,
            `Preview ${i} for ${attrs.title}`,
            true
          )
      )
    this.tags = tags.map((tag) => ({ slug: tag.slug, name: tag.name }))
    this.publisher = publisher
      ? new Publisher({ ...publisher, claimed: false })
      : undefined
    this.links = attrs.links ?? []
  }

  get tagNames() {
    return this.tags.map((tag) => tag.name)
  }
}
