import { AuthedService } from 'src/core/services/base'
import { z } from 'zod'

export type fetchPitchesOutput = Awaited<
  ReturnType<typeof fetchAuthoredPitches.call>
>
export const fetchAuthoredPitches = new AuthedService(
  z.undefined(),
  async (_, { payload, user }) => {
    const { docs } = await payload.find({
      collection: 'pitches',
      where: { author: { equals: user.id } },
      depth: 0
    })

    return docs
  }
)
