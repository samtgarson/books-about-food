import prisma, { Prisma } from 'database'

export type FetchPublishersOptions = {
  page?: number
  perPage?: number
  search?: string
}

export const fetchPublishers = async ({
  page = 0,
  perPage = 20,
  search: contains
}: FetchPublishersOptions) => {
  const where: Prisma.PublisherWhereInput = {
    name: { contains, mode: 'insensitive' }
  }

  const [publishers, total, filteredTotal] = await Promise.all([
    prisma.publisher.findMany({
      where,
      orderBy: { name: 'asc' },
      take: perPage === 0 ? undefined : perPage,
      skip: perPage * page
    }),
    prisma.publisher.count(),
    prisma.publisher.count({ where })
  ])

  return { publishers, total, filteredTotal, perPage }
}
