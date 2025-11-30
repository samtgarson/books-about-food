import { AuthedService } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import { z } from 'zod'

export const destroyClaim = new AuthedService(
  z.object({
    claimId: z.string()
  }),
  async ({ claimId }, user) => {
    if (!claimId) return null

    const claim = await prisma.claim.findUnique({
      where: { id: claimId }
    })
    if (!claim || claim.userId !== user.id) return null

    await prisma.claim.update({
      where: { id: claimId },
      data: { cancelledAt: new Date() }
    })
    return null
  }
)
