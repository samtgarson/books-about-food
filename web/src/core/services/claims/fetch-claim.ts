import prisma from '@books-about-food/database'
import { AuthedService } from 'src/core/services/base'
import { z } from 'zod'

export const fetchClaim = new AuthedService(
  z.object({
    profileId: z.string()
  }),
  async ({ profileId }, { user }) => {
    const userId = user.id

    return prisma.claim.findUnique({
      where: {
        userId_profileId: {
          userId,
          profileId
        },
        cancelledAt: null
      }
    })
  }
)
