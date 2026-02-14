import { Where } from 'payload'
import z from 'zod'
import { Collection } from '../../models/collection'
import { Service } from '../base'
import { paginationInput } from '../utils/inputs'
import { COLLECTION_DEPTH } from '../utils/payload-depth'

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
  async function (
    {
      publisherSlug,
      page = 0,
      perPage = 12,
      publisherFeatured = false,
      sort = 'name'
    },
    { payload }
  ) {
    const where: Where = {
      status: { equals: 'published' },
      publisherFeatured: { equals: publisherFeatured }
    }

    if (publisherSlug) {
      where['publisher.slug'] = { equals: publisherSlug }
    }

    const sortField = sort === 'name' ? 'title' : '-createdAt'

    // Fetch collections with conditional pagination
    const result = await payload.find({
      collection: 'collections',
      where,
      ...(perPage === 'all'
        ? { pagination: false }
        : { page: page + 1, limit: perPage }),
      sort: sortField,
      depth: COLLECTION_DEPTH
    })

    return {
      collections: result.docs.map((collection) => new Collection(collection)),
      total: result.totalDocs,
      perPage: perPage === 'all' ? ('all' as const) : perPage
    }
  }
)
