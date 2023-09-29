import prisma from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'

export const destroyAccount = new Service(
  z.object({ provider: z.string() }),
  async ({ provider } = {}, user) => {
    if (!user) return null

    return prisma.account.deleteMany({
      where: { userId: user.id, provider }
    })
  }
)
