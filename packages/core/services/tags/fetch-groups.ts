import { Service } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import { z } from 'zod'

export const fetchTagGroups = new Service(z.undefined(), async function () {
  return prisma.tagGroup.findMany({
    orderBy: { name: 'asc' },
    include: { tags: true },
    where: {
      tags: { some: { books: { some: { status: 'published' } } } }
    }
  })
})
