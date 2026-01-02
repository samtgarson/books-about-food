import z from 'zod'
import { Collection } from '../../models/collection'
import { Service } from '../base'
import { COLLECTION_DEPTH } from '../utils/payload-depth'

export const fetchCollection = new Service(
  z.object({ slug: z.string().optional() }),
  async function ({ slug }, { payload }) {
    const { docs } = await payload.find({
      collection: 'collections',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' }
      },
      limit: 1,
      depth: COLLECTION_DEPTH
    })

    if (!docs[0]) {
      throw new Error('Collection not found')
    }

    return new Collection(docs[0])
  }
)
