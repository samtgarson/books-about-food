import { Where } from 'payload'
import { Publisher } from 'src/core/models/publisher'
import { Service } from 'src/core/services/base'
import { PUBLISHER_DEPTH } from 'src/core/services/utils/payload-depth'
import { z } from 'zod'
import { paginationInput } from '../utils/inputs'

export type FetchPublishersInput = z.infer<(typeof fetchPublishers)['input']>
export type FetchPublishersOutput = Awaited<
  ReturnType<(typeof fetchPublishers)['call']>
>
export const fetchPublishers = new Service(
  z.object({
    search: z.string().optional(),
    ...paginationInput.shape
  }),
  async ({ page = 0, perPage = 21, search }, { payload }) => {
    const where: Where = {
      'books.status': { equals: 'published' }
    }

    if (search) {
      where.name = { contains: search }
    }

    // Fetch publishers
    const result = await payload.find({
      collection: 'publishers',
      where,
      ...(perPage === 'all'
        ? { pagination: false }
        : { page: page + 1, limit: perPage }),
      sort: 'name',
      depth: PUBLISHER_DEPTH
    })

    const publishers = result.docs.map((publisher) => new Publisher(publisher))

    return {
      publishers,
      total: result.totalDocs,
      perPage: perPage === 'all' ? ('all' as const) : perPage
    }
  }
)
