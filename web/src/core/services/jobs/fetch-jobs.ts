import prisma from '@books-about-food/database'
import { Service } from 'src/core/services/base'
import { z } from 'zod'

export const fetchJobs = new Service(
  z.object({ search: z.string().optional() }),
  async ({ search }, _ctx) =>
    prisma.job.findMany({
      orderBy: { name: 'asc' },
      where: { name: { contains: search, mode: 'insensitive' } }
    })
)
