import prisma from '@books-about-food/database'
import { AuthedService } from 'src/core/services/base'
import { z } from 'zod'

export type CreatePitchInput = z.infer<typeof createPitch.input>

export const createPitch = new AuthedService(
  z.object({
    description: z.string()
  }),
  async ({ description }, { user: author }) => {
    const authorId = author.id

    return prisma.pitch.create({
      data: {
        description,
        authorId
      }
    })
  }
)
