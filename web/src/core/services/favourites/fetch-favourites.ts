import prisma from '@books-about-food/database'
import { Profile } from 'src/core/models/profile'
import { AuthedService } from 'src/core/services/base'
import { z } from 'zod'
import { profileIncludes } from '../utils'

export type fetchFavouritesOutput = Awaited<
  ReturnType<typeof fetchFavourites.call>
>
export const fetchFavourites = new AuthedService(
  z.undefined(),
  async (_, { user }) => {
    const userId = user.id

    const favourites = await prisma.favourite.findMany({
      where: { userId },
      include: { profile: { include: profileIncludes } }
    })

    return favourites.map((favourite) => new Profile(favourite.profile))
  }
)
