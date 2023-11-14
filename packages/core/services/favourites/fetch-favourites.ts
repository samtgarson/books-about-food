import { Profile } from '@books-about-food/core/models/profile'
import { Service } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import { z } from 'zod'
import { profileIncludes } from '../utils'

export type fetchFavouritesOutput = Awaited<
  ReturnType<typeof fetchFavourites.call>
>
export const fetchFavourites = new Service(
  z.undefined(),
  async (_, user) => {
    if (!user) return null
    const userId = user.id

    const favourites = await prisma.favourite.findMany({
      where: { userId },
      include: { profile: { include: profileIncludes } }
    })

    return favourites.map((favourite) => new Profile(favourite.profile))
  },
  {
    cache: {
      maxAge: 0,
      staleFor: 0
    },
    authorized: true
  }
)
