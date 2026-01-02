import { FullBook } from 'src/core/models/full-book'
import { Service } from 'src/core/services/base'
import { FULL_BOOK_DEPTH } from 'src/core/services/utils/payload-depth'
import { z } from 'zod'

export type Feature = Exclude<
  Awaited<ReturnType<(typeof fetchFeatures)['call']>>['data'],
  undefined
>[number]

export const fetchFeatures = new Service(
  z.undefined(),
  async (_input, { payload }) => {
    const { docs } = await payload.find({
      collection: 'features',
      sort: ['order', '-createdAt'],
      where: {
        or: [
          { until: { equals: null } },
          { until: { greater_than_equal: new Date().toISOString() } }
        ]
      },
      depth: FULL_BOOK_DEPTH
    })

    return docs.map((f) => ({ ...f, book: new FullBook(f.book) }))
  }
)
