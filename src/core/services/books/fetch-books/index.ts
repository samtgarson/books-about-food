import { countDistinct } from '@payloadcms/db-postgres/drizzle'
import { Service } from 'src/core/services/base'
import { books } from 'src/payload/schema'
import {
  getSortExpression,
  selectBooks,
  withFiltersAndJoins
} from './query-builder'
import {
  fetchAuthorsForBooks,
  fetchContributionsForBooks,
  fetchPaletteForBooks
} from './related-data'
import { transformToBook } from './transform'
import { validator } from './types'

export type { FetchBooksInput } from './types'
export type FetchBooksOutput = Awaited<ReturnType<(typeof fetchBooks)['call']>>

export const fetchBooks = new Service(
  validator.optional(),
  async (input = {}, { payload }) => {
    const db = payload.db.drizzle
    const {
      page = 0,
      perPage = 23,
      sort: sortKey = 'releaseDate',
      ...filters
    } = input

    // Get count with filters applied
    const countResult = await withFiltersAndJoins(
      db,
      db
        .select({ count: countDistinct(books.id) })
        .from(books)
        .$dynamic(),
      filters
    )

    // Get paginated books with filters applied
    const offset = perPage === 'all' ? 0 : page * perPage
    const limit = perPage === 'all' ? undefined : perPage

    let selectQuery = selectBooks(db, filters, sortKey)
      .orderBy(getSortExpression(sortKey, filters.color))
      .offset(offset)

    if (limit) {
      selectQuery = selectQuery.limit(limit)
    }

    const results = await selectQuery

    // If no books, return early
    if (results.length === 0) {
      return {
        books: [],
        total: 0,
        perPage:
          input.perPage === 'all' ? ('all' as const) : input.perPage || 23
      }
    }

    // Fetch related data for all books
    const bookIds = results.map((r) => r.id)
    const [authorsMap, contributionsMap, paletteMap] = await Promise.all([
      fetchAuthorsForBooks(db, bookIds),
      fetchContributionsForBooks(db, bookIds),
      fetchPaletteForBooks(db, bookIds)
    ])

    const total = Number(countResult[0].count)
    const perPageResult =
      input.perPage === 'all' ? ('all' as const) : input.perPage || 23

    return {
      books: results.map((row) =>
        transformToBook(row, authorsMap, contributionsMap, paletteMap)
      ),
      total,
      perPage: perPageResult
    }
  },
  { cache: 'fetch-books' }
)
