import { FullBook } from 'core/models/full-book'
import { Service } from 'core/services/base'
import prisma from 'database'
import { z } from 'zod'
import { fullBookIncludes } from '../utils/includes'

export type Feature = Exclude<
  Awaited<ReturnType<(typeof fetchFeatures)['call']>>['data'],
  undefined
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
