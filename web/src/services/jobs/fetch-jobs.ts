import prisma from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'

export const fetchJobs = new Service(z.undefined(), async () =>
  prisma.job.findMany({ orderBy: { name: 'asc' } })
)
