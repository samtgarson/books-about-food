import { AuthedService } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import { z } from 'zod'

export const fetchAccounts = new AuthedService(
  z.undefined(),
  async (_, user) => {
    return prisma.account.findMany({
      where: { userId: user.id }
    })
  }
)
