import { AuthedService } from 'src/core/services/base'
import { z } from 'zod'

export const destroyClaim = new AuthedService(
  z.object({
    claimId: z.string()
  }),
  async ({ claimId }, { payload, user }) => {
    if (!claimId) return null

    await payload.update({
      collection: 'claims',
      data: { cancelledAt: new Date().toISOString() },
      where: {
        id: { equals: claimId },
        user: { equals: user.id }
      },
      limit: 1,
      depth: 0
    })

    return null
  }
)
