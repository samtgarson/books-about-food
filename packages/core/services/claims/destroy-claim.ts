import { Service } from 'core/services/base'
import prisma from 'database'
import { z } from 'zod'
import { AppError } from '../utils/errors'

export const destroyClaim = new Service(
  z.object({
    claimId: z.string()
  }),
  async ({ claimId } = {}, user) => {
    if (!user) return null
    if (!claimId) return null

    const claim = await prisma.claim.findUnique({
      where: { id: claimId }
    })
    if (!claim) return null
    if (claim.userId !== user.id)
      throw new AppError('NotFound', 'No claim could be found with that ID')

    await prisma.claim.delete({ where: { id: claimId } })
    return null
  }
)
