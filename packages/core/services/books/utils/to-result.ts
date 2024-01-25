import { Book } from '../../../models/book'

export function bookToResult(book: Book) {
  return {
    id: book.id,
    title: book.title,
    authors: book.authors.map((author) => author.name),
    image: book.cover?.src
  }
}
