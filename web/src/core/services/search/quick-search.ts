import prisma from '@books-about-food/database'
import { Service } from 'src/core/services/base'
import z from 'zod'

export const quickSearch = new Service(
  z.object({ query: z.string() }),
  async ({ query }, _ctx) => {
    if (query.length < 3) return []

    const contains = query
    return await prisma.searchResult.findMany({
      where: {
        OR: [
          { name: { contains, mode: 'insensitive' } },
          { description: { contains, mode: 'insensitive' } }
        ]
      },
      orderBy: {
        _relevance: {
          fields: ['name'],
          search: query.replace(/[\s\n\t]/g, '_'),
          sort: 'desc'
        }
      }
      // cacheStrategy: { ttl: 60, swr: 60 * 10 }
    })
  }
)
