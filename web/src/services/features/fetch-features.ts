import prisma from 'database'
import { Book } from 'src/models/book'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { bookIncludes } from '../utils'

export type Feature = Awaited<ReturnType<typeof fetchFeatures['call']>>[number]

export const fetchFeatures = new Service(z.undefined(), async () => {
  const raw = await prisma.feature.findMany({
    orderBy: { createdAt: 'desc' },
    where: {
      OR: [{ until: null }, { until: { gte: new Date() } }]
    },
    include: {
      book: { include: bookIncludes }
    }
  })

  return raw.map((f) => ({ ...f, book: new Book(f.book) }))
})
