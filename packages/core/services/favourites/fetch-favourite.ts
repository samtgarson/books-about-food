import { AuthedService } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import { z } from 'zod'

export const fetchFavourite = new AuthedService(
  z.object({
    profileId: z.string()
  }),
  async ({ profileId } = {}, user) => {
    const userId = user.id

    return prisma.favourite.findUnique({
      where: {
        profileId_userId: {
          userId,
          profileId
        }
      }
    })
  }
)
