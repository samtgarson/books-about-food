import prisma, { Prisma } from '@books-about-food/database'
import z from 'zod'
import { Collection } from '../../models/collection'
import { Service } from '../base'
import { collectionIncludes } from '../utils'
import { paginationInput } from '../utils/inputs'

export type FetchCollectionsInput = NonNullable<
  z.infer<(typeof fetchCollections)['input']>
>

const sortOptions = ['name', 'createdAt'] as const

export const fetchCollections = new Service(
  z.object({
    publisherSlug: z.string().optional(),
    publisherFeatured: z.boolean().optional(),
    sort: z.enum(sortOptions).optional(),
    ...paginationInput.shape
  }),
  async function ({
    publisherSlug,
    page = 0,
    perPage = 12,
    publisherFeatured = false,
    sort = 'name'
  }) {
    const where: Prisma.CollectionWhereInput = {
      publisher: publisherSlug ? { slug: publisherSlug } : null,
      publisherFeatured,
      status: 'published'
    }

    const [data, total] = await Promise.all([
      prisma.collection.findMany({
        where,
        orderBy: orderBy(sort),
        take: perPage === 'all' ? undefined : perPage,
        skip: perPage === 'all' ? undefined : page * perPage,
        include: collectionIncludes
      }),
      prisma.collection.count({ where })
    ])

    return {
      collections: data.map((collection) => new Collection(collection)),
      total,
      perPage
    }
  }
)

function orderBy(
  sort: (typeof sortOptions)[number]
): Prisma.CollectionOrderByWithRelationInput {
  switch (sort) {
    case 'name':
      return { title: 'asc' }
    case 'createdAt':
    default:
      return { createdAt: 'desc' }
  }
}
