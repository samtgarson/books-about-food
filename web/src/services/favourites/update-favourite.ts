import prisma from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'

export const updateFavourite = new Service(
  z.object({
    profileId: z.string(),
    isFavourite: z.boolean()
  }),
  async ({ profileId, isFavourite } = {}, user) => {
    if (!user || !profileId) return null
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

    return prisma.favourite.delete({
      where: {
        profileId_userId: {
          profileId,
          userId
        }
      }
    })
  }
)
