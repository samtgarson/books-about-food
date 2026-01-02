import prisma from '@books-about-food/database'
import { AuthedService } from 'src/core/services/base'
import { z } from 'zod'

export const fetchFavourite = new AuthedService(
  z.object({
    profileId: z.string()
  }),
  async ({ profileId }, { user }) => {
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
