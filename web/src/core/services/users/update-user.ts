import prisma, { Prisma } from '@books-about-food/database'
import { z } from 'zod'
import { AuthedService } from '../base'

export type UpdateUserInput = z.infer<typeof updateUser.input>

export const updateUser = new AuthedService(
  z.object({
    name: z.string().min(1).optional(),
    email: z.email().optional()
  }),
  async (params, { user }) => {
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
