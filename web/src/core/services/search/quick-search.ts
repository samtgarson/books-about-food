import { Service } from 'src/core/services/base'
import z from 'zod'

export const quickSearch = new Service(
  z.object({ query: z.string() }),
  async ({ query }, { payload }) => {
    if (query.length < 3) return []

    // Two queries for relevance sorting: name matches first, then description-only matches
    const [nameMatches, descriptionMatches] = await Promise.all([
      payload.find({
        collection: 'search-results',
        where: { name: { contains: query } },
        sort: 'name',
        limit: 20,
        depth: 1
      }),
      payload.find({
        collection: 'search-results',
        where: {
          and: [
            { description: { contains: query } },
            { name: { not_like: query } }
          ]
        },
        sort: 'name',
        limit: 20,
        depth: 1
      })
    ])

    // Combine results, prioritizing name matches
    const combined = [...nameMatches.docs, ...descriptionMatches.docs]
    return combined.slice(0, 20)
  }
)
