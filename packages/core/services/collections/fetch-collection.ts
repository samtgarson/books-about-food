import prisma from '@books-about-food/database'
import z from 'zod'
import { Collection } from '../../models/collection'
import { Service } from '../base'
import { collectionIncludes } from '../utils'

export const fetchCollection = new Service(
  z.object({ publisherSlug: z.string().optional() }),
  async function ({ publisherSlug } = {}) {
    const data = await prisma.collection.findMany({
      where: {
        publisher: { slug: publisherSlug },
        OR: [{ until: { gt: new Date() } }, { until: { equals: null } }]
      },
      orderBy: { createdAt: 'desc' },
      take: 1,
      include: collectionIncludes
    })

    return data.map((collection) => new Collection(collection))[0]
  }
)
