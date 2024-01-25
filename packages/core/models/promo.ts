import { Book } from './book'
import { PromoAttrs } from './types'

export class Promo {
  id: string
  books: Book[]
  title: string

  constructor(attrs: PromoAttrs) {
    this.id = attrs.id
    this.books = attrs.promoItems.map((item) => new Book(item.book))
    this.title = attrs.title
  }
}
