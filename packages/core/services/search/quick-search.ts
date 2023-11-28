import { Service } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import z from 'zod'

export const quickSearch = new Service(
  z.object({ query: z.string() }),
  async ({ query } = {}) => {
    if (query.length < 3) return []

    const contains = `%${query.trim()}%`
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
          search: query,
          sort: 'desc'
        }
      },
      cacheStrategy: { ttl: 60, swr: 60 * 10 }
    })
  }
)
