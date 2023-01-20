import prisma, { Prisma } from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'

export type FetchPublishersInput = z.infer<typeof fetchPublishers['input']>
export type FetchPublishersOutput = Awaited<
  ReturnType<typeof fetchPublishers['call']>
>
export const fetchPublishers = new Service(
  z
    .object({
      page: z.number().optional(),
      perPage: z.number().optional(),
      search: z.string().optional()
    })
    .optional(),
  async ({ page = 0, perPage = 21, search: contains } = {}) => {
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
)
