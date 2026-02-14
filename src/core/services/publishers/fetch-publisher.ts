import z from 'zod'
import { Publisher } from '../../models/publisher'
import { Service } from '../base'
import { PUBLISHER_DEPTH } from '../utils/payload-depth'

export const fetchPublisher = new Service(
  z.object({ slug: z.string() }),
  async function ({ slug }, { payload }) {
    const { docs } = await payload.find({
      collection: 'publishers',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: PUBLISHER_DEPTH
    })

    if (docs[0]) return new Publisher(docs[0])
  }
)
