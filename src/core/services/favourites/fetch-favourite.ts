import { AuthedService } from 'src/core/services/base'
import { z } from 'zod'

export const fetchFavourite = new AuthedService(
  z.object({
    profileId: z.string()
  }),
  async ({ profileId }, { payload, user }) => {
    const { docs } = await payload.find({
      collection: 'favourites',
      where: {
        and: [{ user: { equals: user.id } }, { profile: { equals: profileId } }]
      },
      limit: 1,
      depth: 0
    })

    return docs[0] || null
  }
)
