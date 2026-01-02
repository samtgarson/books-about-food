import prisma from '@books-about-food/database'
import { AuthedService } from 'src/core/services/base'
import { z } from 'zod'

export type fetchPitchesOutput = Awaited<
  ReturnType<typeof fetchAuthoredPitches.call>
>
export const fetchAuthoredPitches = new AuthedService(
  z.undefined(),
  async (_, { user }) => {
    const userId = user.id

    return prisma.pitch.findMany({
      where: { authorId: userId }
    })
  }
)
