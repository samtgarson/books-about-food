import prisma from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'

export type fetchFavouritesOutput = Awaited<
  ReturnType<typeof fetchFavourites.call>
>
export const fetchFavourites = new Service(z.undefined(), async (_, user) => {
  if (!user) return null
  const userId = user.id

  return prisma.favourite.findMany({
    where: { userId },
    include: { profile: true }
  })
})
