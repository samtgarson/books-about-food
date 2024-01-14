import { AuthedService } from '@books-about-food/core/services/base'
import prisma, { Prisma } from '@books-about-food/database'
import { z } from 'zod'

export type UpdateUserInput = z.infer<typeof updateUser.input>

export const updateUser = new AuthedService(
  z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional()
  }),
  async (params = {}, user) => {
    const data: Prisma.UserUpdateInput = params

    if (params.email && params.email !== user.email) {
      data.emailVerified = null
    }

    return prisma.user.update({
      where: { id: user.id },
      data
    })
  }
)
