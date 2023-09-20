import prisma from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { FullBook } from 'src/models/full-book'
import { fullBookIncludes } from '../utils/includes'

export type Feature = Awaited<
  ReturnType<(typeof fetchFeatures)['call']>
>[number]

export const fetchFeatures = new Service(z.undefined(), async () => {
  const raw = await prisma.feature.findMany({
    orderBy: { createdAt: 'desc' },
    where: {
      OR: [{ until: null }, { until: { gte: new Date() } }]
    },
    include: {
      book: { include: fullBookIncludes }
    }
  })

  return raw.map((f) => ({ ...f, book: new FullBook(f.book) }))
})
