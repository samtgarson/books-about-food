import prisma, { BookStatus, Prisma, cacheStrategy } from 'database'
import { Book } from 'src/models/book'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { bookIncludes } from '../utils'
import {
  fetchBooksPageFilters,
  FetchBooksPageFilters,
  fetchBooksPageFilterValues
} from './filters'
import {
  array,
  arrayOrSingle,
  dbEnum,
  paginationInput,
  processArray
} from '../utils/inputs'

export type FetchBooksInput = NonNullable<z.infer<(typeof fetchBooks)['input']>>
export type FetchBooksOutput = Awaited<ReturnType<(typeof fetchBooks)['call']>>
export const fetchBooks = new Service(
  z
    .object({
      sort: z.enum(['releaseDate', 'createdAt']).optional(),
      tags: array(z.string()).optional(),
      search: z.string().optional(),
      profile: z.string().optional(),
      status: arrayOrSingle(dbEnum(BookStatus)).optional(),
      submitterId: z.string().optional(),
      pageCount: z
        .custom<FetchBooksPageFilters>((key) => {
          return fetchBooksPageFilterValues.includes(
            key as FetchBooksPageFilters
          )
        })
        .optional()
    })
    .merge(paginationInput)
    .optional(),

  async ({
    page = 0,
    perPage = 18,
    sort = 'releaseDate',
    tags,
    search,
    profile,
    status = 'published' as const,
    submitterId,
    pageCount
  } = {}) => {
    const contains = search?.trim()
    const hasSearch = (contains && contains.length > 0) || undefined
    const hasTag = (tags && tags.length > 0) || undefined
    const mode: Prisma.QueryMode = 'insensitive'

    const AND: Prisma.BookWhereInput[] = [
      { status: { in: processArray(status) } }
    ]
    if (submitterId) AND.push({ submitterId })
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
        orderBy: { [sort]: 'desc' },
        include: bookIncludes,
        where,
        distinct: ['id'],
        cacheStrategy
      }),
      prisma.book.count({ where, cacheStrategy }),
      prisma.book.count({ cacheStrategy })
    ])
    const books = rawBooks.map((book) => new Book(book))
    return { books, filteredTotal, total, perPage }
  }
)
