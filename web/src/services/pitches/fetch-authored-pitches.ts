import prisma from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'

export type fetchPitchesOutput = Awaited<
  ReturnType<typeof fetchAuthoredPitches.call>
>
export const fetchAuthoredPitches = new Service(
  z.undefined(),
  async (_, user) => {
    if (!user) return null
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
