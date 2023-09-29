import prisma from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'

export const fetchAccounts = new Service(z.undefined(), async (_, user) => {
  if (!user) return null

  return prisma.account.findMany({
    where: { userId: user.id }
  })
})
