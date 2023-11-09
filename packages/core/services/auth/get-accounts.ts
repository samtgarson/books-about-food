import { Service } from 'core/services/base'
import prisma from 'database'
import { z } from 'zod'

export const fetchAccounts = new Service(z.undefined(), async (_, user) => {
  if (!user) return null

  return prisma.account.findMany({
    where: { userId: user.id }
  })
})
