import { AuthedService } from 'src/core/services/base'
import { z } from 'zod'

export const updateFavourite = new AuthedService(
  z.object({
    profileId: z.string(),
    isFavourite: z.boolean()
  }),
  async ({ profileId, isFavourite }, { payload, user }) => {
    if (!profileId) return null

    if (isFavourite) {
      // Check if favourite already exists
      const { docs } = await payload.find({
        collection: 'favourites',
        where: {
          and: [
            { user: { equals: user.id } },
            { profile: { equals: profileId } }
          ]
        },
        limit: 1,
        user
      })

      if (docs[0]) {
        return docs[0]
      }

      // Create new favourite
      return await payload.create({
        collection: 'favourites',
        data: {
          user: user.id,
          profile: profileId
        },
        user
      })
    }

    // Delete favourite
    const { docs } = await payload.find({
      collection: 'favourites',
      where: {
        and: [{ user: { equals: user.id } }, { profile: { equals: profileId } }]
      },
      limit: 1,
      user
    })

    if (docs[0]) {
      await payload.delete({
        collection: 'favourites',
        id: docs[0].id,
        user
      })
    }
  }
)
