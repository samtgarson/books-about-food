import prisma from 'database'
import { RequestException } from 'src/contexts/fetcher/exceptions'
import { Service } from 'src/utils/service'
import { z } from 'zod'

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
    if (!claim) throw new RequestException(404)
    if (claim.userId !== user.id) throw new RequestException(403)

    await prisma.claim.delete({ where: { id: claimId } })
    return null
  }
)
