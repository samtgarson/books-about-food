import { Profile } from 'src/core/models/profile'
import { AuthedService } from 'src/core/services/base'
import { PROFILE_DEPTH } from 'src/core/services/utils/payload-depth'
import type { Profile as PayloadProfile } from 'src/payload/payload-types'
import { z } from 'zod'

export type fetchFavouritesOutput = Awaited<
  ReturnType<typeof fetchFavourites.call>
>
export const fetchFavourites = new AuthedService(
  z.undefined(),
  async (_, { payload, user }) => {
    const { docs } = await payload.find({
      collection: 'favourites',
      where: { user: { equals: user.id } },
      depth: PROFILE_DEPTH + 1, // favourite.profile is one deep already
      pagination: false,
      user
    })

    return docs.map(
      (favourite) => new Profile(favourite.profile as PayloadProfile)
    )
  }
)
