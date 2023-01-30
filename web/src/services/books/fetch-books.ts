import prisma, { Prisma } from 'database'
import { Book } from 'src/models/book'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { profileIncludes } from '../utils'
import {
  fetchBooksPageFilters,
  FetchBooksPageFilters,
  fetchBooksPageFilterValues
} from './filters'

export type FetchBooksInput = NonNullable<z.infer<typeof fetchBooks['input']>>
export type FetchBooksOutput = Awaited<ReturnType<typeof fetchBooks['call']>>
export const fetchBooks = new Service(
  z
    .object({
      page: z.number().optional(),
      perPage: z.number().optional(),
      sort: z.enum(['title', 'releaseDate', 'createdAt']).optional(),
      tag: z.string().array().optional(),
      search: z.string().optional(),
      profile: z.string().optional(),
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
    tag,
    search,
    profile,
    pageCount
  } = {}) => {
    const contains = search?.trim()
    const hasSearch = (contains && contains.length > 0) || undefined
    const hasTag = (tag && tag.length > 0) || undefined
    const mode: Prisma.QueryMode = 'insensitive'
    const AND: Prisma.BookWhereInput[] = []
    if (hasTag) AND.push({ tags: { some: { name: { in: tag } } } })
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
        include: {
          coverImage: true,
          contributions: {
            include: { profile: profileIncludes, job: true },
            where: { job: { name: 'Author' } }
          }
        },
        where
      }),
      prisma.book.count({ where }),
      prisma.book.count()
    ])
    const books = rawBooks.map((book) => new Book(book))
    return { books, filteredTotal, total, perPage }
  }
)
