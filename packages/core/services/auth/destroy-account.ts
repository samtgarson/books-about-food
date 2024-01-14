import { AuthedService } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import { z } from 'zod'

export const destroyAccount = new AuthedService(
  z.object({ provider: z.string() }),
  async ({ provider } = {}, user) => {
    return prisma.account.deleteMany({
      where: { userId: user.id, provider }
    })
  }
)
