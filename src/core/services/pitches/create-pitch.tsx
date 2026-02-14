import { AuthedService } from 'src/core/services/base'
import { z } from 'zod'

export type CreatePitchInput = z.infer<typeof createPitch.input>

export const createPitch = new AuthedService(
  z.object({
    description: z.string()
  }),
  async ({ description }, { payload, user: author }) => {
    return payload.create({
      collection: 'pitches',
      data: {
        description,
        author: author.id
      },
      depth: 0
    })
  }
)
