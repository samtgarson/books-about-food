import { Service } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import { z } from 'zod'

export const fetchTags = new Service(
  z.object({ search: z.string().optional() }),
  async ({ search } = {}) =>
    prisma.tag.findMany({
      orderBy: { name: 'asc' },
      where: { name: { contains: search, mode: 'insensitive' } }
    })
)
