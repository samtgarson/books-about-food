import prisma, { cacheStrategy } from 'database'
import { Service } from 'src/utils/service'
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
