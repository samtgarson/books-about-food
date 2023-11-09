import { Service } from 'core/services/base'
import prisma from 'database'
import { z } from 'zod'

export const fetchFavourite = new Service(
  z.object({
    profileId: z.string()
  }),
  async ({ profileId } = {}, user) => {
    if (!user) return null
    const userId = user.id

    return prisma.favourite.findUnique({
      where: {
        profileId_userId: {
          userId,
          profileId
        }
      }
    })
  },
  {
    cache: {
      maxAge: 0,
      staleFor: 0
    },
    authorized: true
  }
)
