import prisma from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'

export const updateUser = new Service(
  z.object({
    name: z.string().min(1).optional()
  }),
  async (data = {}, user) => {
    if (!user) throw new Error('User is required')

    prisma.user.update({
      where: { id: user.id },
      data
    })
  }
)
