import { AuthedService } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import { z } from 'zod'

export type CreatePitchInput = z.infer<typeof createPitch.input>

export const createPitch = new AuthedService(
  z.object({
    description: z.string()
  }),
  async ({ description }, author) => {
    const authorId = author.id

    return prisma.pitch.create({
      data: {
        description,
        authorId
      }
    })
  }
)
