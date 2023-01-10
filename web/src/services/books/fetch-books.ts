import prisma, { Prisma } from 'database'
import { Book } from 'src/models/book'

export type FetchBooksOptions = {
  page?: number
  perPage?: number
  sort?: keyof Pick<
    Prisma.BookCreateInput,
    'title' | 'releaseDate' | 'createdAt'
  >
  tag?: string
  search?: string
}

export const fetchBooks = async ({
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

  const [rawBooks, filteredTotal, total] = await Promise.all([
    prisma.book.findMany({
      take: perPage === 0 ? undefined : perPage,
      skip: perPage * page,
      orderBy: { [sort]: sort === 'title' ? 'asc' : 'desc' },
      include: { coverImage: true },
      where
    }),
    prisma.book.count({ where }),
    prisma.book.count()
  ])
  const books = rawBooks.map((book) => new Book(book))
  return { books, filteredTotal, total, perPage }
}
