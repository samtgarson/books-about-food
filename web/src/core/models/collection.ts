import type { Collection as PayloadCollection } from 'src/payload/payload-types'
import { BaseModel } from '.'
import { Book } from './book'
import { extractId, requirePopulatedArray } from './utils/payload-validation'

export class Collection extends BaseModel {
  _type = 'collection' as const
  id: string
  slug: string
  books: Book[]
  title: string
  description?: string
  publisherId?: string
  bookshopDotOrgUrl?: string

  constructor(attrs: PayloadCollection) {
    super()

    // Validate relationships are populated
    const books = requirePopulatedArray(attrs.books, 'Collection.books')

    this.id = attrs.id
    this.slug = attrs.slug
    this.books = books.map((book) => new Book(book))
    this.title = attrs.title
    this.description = attrs.description ?? undefined
    this.publisherId = extractId(attrs.publisher)
    this.bookshopDotOrgUrl = attrs.bookshopDotOrgUrl ?? undefined
  }

  get colors() {
    return this.books.slice(0, 12).map((book) => book.backgroundColor)
  }

  get href() {
    return `/collections/${this.slug}`
  }

  get name() {
    return this.title
  }
}
