import prisma, { Prisma } from '@books-about-food/database'
import { z } from 'zod'
import { Service } from '../base'

const searchLocationOptionsSchema = z.object({
  query: z.string().min(2).nullish(),
  sort: z.literal(['relevance', 'popularity']).optional().default('relevance'),
  limit: z.number().min(1).optional().default(20)
})

export type SearchLocationOptionsInput = z.input<
  typeof searchLocationOptionsSchema
>

export const searchLocationOptions = new Service(
  searchLocationOptionsSchema,
  async function ({ query, sort, limit: take }) {
    const orderBy: Prisma.LocationFilterOptionOrderByWithRelationInput = {}
    if (sort === 'popularity' || !query?.length) {
      orderBy.profileCount = 'desc'
    } else {
      orderBy._relevance = {
        fields: ['value'],
        search: query.replace(/[\s\n\t]/g, '_'),
        sort: 'desc'
      }
    }

    return await prisma.locationFilterOption.findMany({
      where: {
        value: query?.length
          ? {
              contains: query,
              mode: 'insensitive'
            }
          : undefined
      },
      orderBy,
      take
    })
  }
)
