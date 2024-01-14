import { AuthedService } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import { z } from 'zod'

export const updateFavourite = new AuthedService(
  z.object({
    profileId: z.string(),
    isFavourite: z.boolean()
  }),
  async ({ profileId, isFavourite } = {}, user) => {
    if (!profileId) return null
    const userId = user.id

    if (isFavourite) {
      return prisma.favourite.upsert({
        create: {
          userId,
          profileId
        },
        update: {},
        where: {
          profileId_userId: {
            profileId,
            userId
          }
        }
      })
    }

    await prisma.favourite.delete({
      where: {
        profileId_userId: {
          profileId,
          userId
        }
      }
    })
  }
)
