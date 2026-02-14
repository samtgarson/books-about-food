import { AuthedService } from 'src/core/services/base'
import { z } from 'zod'

export const fetchClaim = new AuthedService(
  z.object({
    profileId: z.string()
  }),
  async ({ profileId }, { payload, user }) => {
    const { docs } = await payload.find({
      collection: 'claims',
      where: {
        and: [
          { user: { equals: user.id } },
          { profile: { equals: profileId } },
          { cancelledAt: { equals: null } }
        ]
      },
      limit: 1,
      user
    })

    return docs[0] || null
  }
)
