import { Service } from 'core/services/base'
import prisma, { cacheStrategy } from 'database'
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
