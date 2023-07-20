import prisma from 'database'
import { Profile } from 'src/models/profile'
import { Service } from 'src/utils/service'
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
