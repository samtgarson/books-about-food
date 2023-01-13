import prisma from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'

export const fetchTags = new Service(z.undefined(), async () =>
  prisma.tag.findMany({ orderBy: { name: 'asc' } })
)
