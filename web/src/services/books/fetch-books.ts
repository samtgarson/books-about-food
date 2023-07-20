import prisma, { BookStatus, Prisma } from 'database'
import { Book } from 'src/models/book'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { bookIncludes } from '../utils'
import {
  fetchBooksPageFilters,
  FetchBooksPageFilters,
  fetchBooksPageFilterValues
} from './filters'
import { array, dbEnum, numeric } from '../utils/inputs'

export type FetchBooksInput = NonNullable<z.infer<(typeof fetchBooks)['input']>>
export type FetchBooksOutput = Awaited<ReturnType<(typeof fetchBooks)['call']>>
export const fetchBooks = new Service(
  z
    .object({
      page: numeric.optional(),
      perPage: numeric.optional(),
      sort: z.enum(['title', 'releaseDate', 'createdAt']).optional(),
      tags: array(z.string()).optional(),
      search: z.string().optional(),
      profile: z.string().optional(),
      status: array(dbEnum(BookStatus)).optional(),
      pageCount: z
        .custom<FetchBooksPageFilters>((key) => {
          return fetchBooksPageFilterValues.includes(
            key as FetchBooksPageFilters
          )
        })
        .optional()
    })
    .optional(),

  async ({
    page = 0,
    perPage = 18,
    sort = 'releaseDate',
    tags,
    search,
    profile,
    status = ['published' as const],
    pageCount
  } = {}) => {
    const contains = search?.trim()
    const hasSearch = (contains && contains.length > 0) || undefined
    const hasTag = (tags && tags.length > 0) || undefined
    const mode: Prisma.QueryMode = 'insensitive'

    const AND: Prisma.BookWhereInput[] = [{ status: { in: status } }]
    if (hasTag) AND.push({ tags: { some: { name: { in: tags } } } })
    if (profile) {
      AND.push({ contributions: { some: { profile: { slug: profile } } } })
    }

    if (pageCount) {
      const pageCountFilter = fetchBooksPageFilters.find(
        (f) => f.value === pageCount
      )
      if (pageCountFilter) {
        const { min, max } = pageCountFilter
        AND.push({ pages: { gte: min, lte: max } })
      }
    }

    const where = {
      AND,
      OR: hasSearch && [
        { title: { contains, mode } },
        { subtitle: { contains, mode } },
        { publisher: { name: { contains, mode } } },
        { contributions: { some: { profile: { name: { contains, mode } } } } },
        { tags: { some: { name: { contains, mode } } } }
      ]
    }

    const [rawBooks, filteredTotal, total] = await Promise.all([
      prisma.book.findMany({
        take: perPage === 0 ? undefined : perPage,
        skip: perPage * page,
        orderBy: { [sort]: sort === 'title' ? 'asc' : 'desc' },
        include: bookIncludes,
        where
      }),
      prisma.book.count({ where }),
      prisma.book.count()
    ])
    const books = rawBooks.map((book) => new Book(book))
    return { books, filteredTotal, total, perPage }
  }
)
