import { Service } from 'core/services/base'
import prisma from 'database'
import z from 'zod'

export const quickSearch = new Service(
  z.object({ query: z.string() }),
  async ({ query } = {}) => {
    if (query.length < 3) return []

    return await prisma.searchResult.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: {
        _relevance: {
          fields: ['name', 'description'],
          search: query.trim().split(' ').join(' & '),
          sort: 'desc'
        }
      },
      cacheStrategy: { ttl: 60, swr: 60 * 10 }
    })
  }
)