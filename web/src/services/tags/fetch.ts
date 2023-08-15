import prisma, { cacheStrategy } from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'

export const fetchTags = new Service(
  z.object({ search: z.string().optional() }),
  async ({ search } = {}) =>
    prisma.tag.findMany({
      orderBy: { name: 'asc' },
      where: { name: { contains: search, mode: 'insensitive' } },
      cacheStrategy
    })
)
