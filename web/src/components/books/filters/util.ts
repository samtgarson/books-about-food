import { FetchBooksInput } from 'src/core/services/books/fetch-books'

export type Filters = Omit<FetchBooksInput, 'perPage'>

export function count(filters: Filters) {
  if (Object.keys(filters).length === 0) return 0

  let count = filters.tags?.length ?? 0
  if (filters.color) count++
  if (filters.sort && filters.sort !== 'releaseDate') count++
  return count
}
