import { Book } from './book'
import { CollectionAttrs } from './types'

export class Collection {
  id: string
  books: Book[]
  title: string
  publisherId?: string

  constructor(attrs: CollectionAttrs) {
    this.id = attrs.id
    this.books = attrs.collectionItems.map((item) => new Book(item.book))
    this.title = attrs.title
    this.publisherId = attrs.publisherId || undefined
  }
}
