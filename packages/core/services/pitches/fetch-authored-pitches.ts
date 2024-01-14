import { AuthedService } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import { z } from 'zod'

export type fetchPitchesOutput = Awaited<
  ReturnType<typeof fetchAuthoredPitches.call>
>
export const fetchAuthoredPitches = new AuthedService(
  z.undefined(),
  async (_, user) => {
    const userId = user.id

    return prisma.pitch.findMany({
      where: { authorId: userId }
    })
  },
  {
    cache: {
      maxAge: 0,
      staleFor: 0
    },
    authorized: true
  }
)
