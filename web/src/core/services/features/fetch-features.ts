import prisma from '@books-about-food/database'
import { FullBook } from 'src/core/models/full-book'
import { Service } from 'src/core/services/base'
import { z } from 'zod'
import { fullBookIncludes } from '../utils/includes'

export type Feature = Exclude<
  Awaited<ReturnType<(typeof fetchFeatures)['call']>>['data'],
  undefined
>[number]

export const fetchFeatures = new Service(
  z.undefined(),
  async (_input, _ctx) => {
    const raw = await prisma.feature.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      where: {
        OR: [{ until: null }, { until: { gte: new Date() } }]
      },
      include: {
        book: { include: fullBookIncludes }
      }
    })

    return raw.map((f) => ({ ...f, book: new FullBook(f.book) }))
  }
)
