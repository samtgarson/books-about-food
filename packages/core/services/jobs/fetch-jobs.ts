import { Service } from '@books-about-food/core/services/base'
import prisma, { cacheStrategy } from '@books-about-food/database'
import { z } from 'zod'

export const fetchJobs = new Service(
  z.object({ search: z.string().optional() }),
  async ({ search } = {}) =>
    prisma.job.findMany({
      orderBy: { name: 'asc' },
      where: { name: { contains: search, mode: 'insensitive' } },
      cacheStrategy
    })
)
