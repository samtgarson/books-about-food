import prisma from '@books-about-food/database'
import { AuthedService } from 'src/core/services/base'
import { z } from 'zod'

export const destroyAccount = new AuthedService(
  z.object({ provider: z.string() }),
  async ({ provider }, { user }) => {
    return prisma.account.deleteMany({
      where: { userId: user.id, provider }
    })
  }
)
