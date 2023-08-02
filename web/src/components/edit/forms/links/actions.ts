'use server'

import prisma from 'database'
import { stringify } from 'src/utils/superjson'

export const getSites = async () =>
  stringify(
    (
      await prisma.link.findMany({
        select: { site: true },
        orderBy: { site: 'asc' },
        distinct: ['site']
      })
    ).map(({ site }) => ({ value: site }))
  )
