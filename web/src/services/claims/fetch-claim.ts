import prisma from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'

export const fetchClaim = new Service(
  z
    .object({
      profileId: z.string(),
      publisherId: z.never().optional()
    })
    .or(
      z.object({
        publisherId: z.string(),
        profileId: z.never().optional()
      })
    ),
  async ({ profileId, publisherId } = {}, user) => {
    if (!user) return
    if (!profileId && !publisherId) return
    const userId = user.id

    if (profileId)
      return prisma.claim.findUnique({
        where: {
          userId_profileId: {
            userId,
            profileId
          }
        }
      })

    if (publisherId)
      return prisma.claim.findUnique({
        where: {
          userId_publisherId: {
            userId,
            publisherId
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
