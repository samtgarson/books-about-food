import prisma, { Book } from 'database'

export type FetchBooksOptions = {
  page?: number
  perPage?: number
  sort?: keyof Pick<Book, 'title' | 'releaseDate' | 'createdAt'>
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
  const hasSearch = (search && search.length > 0) || undefined
  const hasTag = (tag && tag.length > 0) || undefined
  const where = {
    AND: hasTag && {
      tags: { some: { id: tag } }
    },
    OR: hasSearch && [
      { title: { search } },
      { subtitle: { search } },
      { publisher: { name: { search } } },
      { contributions: { some: { profile: { name: { search } } } } }
    ]
  }

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      take: 10,
      skip: 10 * page,
      orderBy: { [sort]: sort === 'title' ? 'asc' : 'desc' },
      where
    }),
    prisma.book.count({ where })
  ])
  return { books, total, perPage }
}
