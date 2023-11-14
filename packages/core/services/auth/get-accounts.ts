import { Service } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import { z } from 'zod'

export const fetchAccounts = new Service(z.undefined(), async (_, user) => {
  if (!user) return null

  return prisma.account.findMany({
    where: { userId: user.id }
  })
})
