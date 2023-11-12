import { Service } from 'core/services/base'
import prisma from 'database'
import { z } from 'zod'

export const fetchClaim = new Service(
  z.object({
    profileId: z.string()
  }),
  async ({ profileId } = {}, user) => {
    if (!user) return
    const userId = user.id

    return prisma.claim.findUnique({
      where: {
        userId_profileId: {
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