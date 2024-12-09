import prisma from '@books-about-food/database'
import z from 'zod'
import { Collection } from '../../models/collection'
import { Service } from '../base'
import { collectionIncludes } from '../utils'

export const fetchCollections = new Service(
  z.object({
    publisherSlug: z.string().nullish().default(null),
    page: z.number().default(0),
    perPage: z.number().default(12)
  }),
  async function ({ publisherSlug, page, perPage } = {}) {
    const data = await prisma.collection.findMany({
      where: {
        publisher: publisherSlug ? { slug: publisherSlug } : null,
        OR: [{ until: { gt: new Date() } }, { until: { equals: null } }]
      },
      orderBy: { createdAt: 'desc' },
      take: perPage === 0 ? undefined : perPage,
      skip: page * perPage || 0,
      include: collectionIncludes
    })

    return data.map((collection) => new Collection(collection))
  }
)
