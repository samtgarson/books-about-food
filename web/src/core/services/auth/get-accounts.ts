import prisma from '@books-about-food/database'
import { AuthedService } from 'src/core/services/base'
import { z } from 'zod'

export const fetchAccounts = new AuthedService(
  z.undefined(),
  async (_, { user }) => {
    return prisma.account.findMany({
      where: { userId: user.id }
    })
  }
)
