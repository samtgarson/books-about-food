import { Service } from 'src/core/services/base'
import z from 'zod'

export const quickSearch = new Service(
  z.object({ query: z.string() }),
  async ({ query }, { payload }) => {
    if (query.length < 3) return []

    const { docs } = await payload.find({
      collection: 'search-results',
      where: {
        or: [
          { name: { contains: query } },
          { description: { contains: query } }
        ]
      },
      sort: 'name',
      limit: 20,
      depth: 1 // Populate image relationship
    })

    return docs
  }
)
