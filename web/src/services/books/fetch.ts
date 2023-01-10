import prisma, { Book, Prisma } from 'database'
import { cache } from 'react'

export type FetchBooksOptions = {
  page?: number
  perPage?: number
  sort?: keyof Pick<Book, 'title' | 'releaseDate' | 'createdAt'>
  tag?: string
  search?: string
}

export const fetchBooks = cache(
  async ({
    page = 0,
    perPage = 10,
    sort = 'releaseDate',
    tag,
    search
  }: FetchBooksOptions) => {
    const contains = search?.trim()
    const hasSearch = (contains && contains.length > 0) || undefined
    const hasTag = (tag && tag.length > 0) || undefined
    const mode: Prisma.QueryMode = 'insensitive'
    const where = {
      AND: hasTag && {
        tags: { some: { name: tag } }
      },
      OR: hasSearch && [
        { title: { contains, mode } },
        { subtitle: { contains, mode } },
        { publisher: { name: { contains, mode } } },
        { contributions: { some: { profile: { name: { contains, mode } } } } },
        { tags: { some: { name: { contains, mode } } } }
      ]
    }

    const [books, filteredTotal, total] = await Promise.all([
      prisma.book.findMany({
        take: perPage === 0 ? undefined : perPage,
        skip: perPage * page,
        orderBy: { [sort]: sort === 'title' ? 'asc' : 'desc' },
        where
      }),
      prisma.book.count({ where }),
      prisma.book.count()
    ])
    return { books, filteredTotal, total, perPage }
  }
)
