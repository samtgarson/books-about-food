import prisma from '@books-about-food/database'
import { Service } from 'src/core/services/base'
import { tagGroupIncludes } from 'src/core/services/utils'
import { z } from 'zod'

export const fetchTagGroups = new Service(z.undefined(), async function (
  _input,
  _ctx
) {
  return prisma.tagGroup.findMany({
    orderBy: { name: 'asc' },
    include: tagGroupIncludes,
    where: {
      adminOnly: false,
      tags: { some: { books: { some: { status: 'published' } } } }
    }
  })
})
