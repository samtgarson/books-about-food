import { BaseModel } from '.'
import { Book } from './book'
import { CollectionAttrs } from './types'

export class Collection extends BaseModel {
  _type = 'collection' as const
  id: string
  slug: string
  books: Book[]
  title: string
  description?: string
  publisherId?: string
  bookshopDotOrgUrl?: string

  constructor(attrs: CollectionAttrs) {
    super()
    this.id = attrs.id
    this.slug = attrs.slug
    this.books = attrs.collectionItems.map((item) => new Book(item.book))
    this.title = attrs.title
    this.description = attrs.description || undefined
    this.publisherId = attrs.publisherId || undefined
    this.bookshopDotOrgUrl = attrs.bookshopDotOrgUrl || undefined
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
