import { Publisher } from '@books-about-food/core/models/publisher'
import { Service } from '@books-about-food/core/services/base'
import prisma, { Prisma } from '@books-about-food/database'
import { z } from 'zod'
import { paginationInput } from '../utils/inputs'

export type FetchPublishersInput = z.infer<(typeof fetchPublishers)['input']>
export type FetchPublishersOutput = Awaited<
  ReturnType<(typeof fetchPublishers)['call']>
>
export const fetchPublishers = new Service(
  z
    .object({
      search: z.string().optional()
    })
    .merge(paginationInput)
    .optional(),
  async ({ page = 0, perPage = 21, search: contains } = {}) => {
    const where: Prisma.PublisherWhereInput = {
      name: { contains, mode: 'insensitive' },
      books: { some: { status: 'published' } }
    }

    const [raw, total, filteredTotal] = await Promise.all([
      prisma.publisher.findMany({
        where,
        orderBy: [
          { logo: { publisher: { books: { _count: 'desc' } } } },
          { name: 'asc' }
        ],
        take: perPage === 0 ? undefined : perPage,
        skip: perPage * page,
        include: { logo: true }
      }),
      prisma.publisher.count(),
      prisma.publisher.count({ where })
    ])

    const publishers = raw.map((publisher) => new Publisher(publisher))

    return { publishers, total, filteredTotal, perPage }
  }
)
