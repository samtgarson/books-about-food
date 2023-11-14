import { Service } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import { z } from 'zod'

export type CreatePitchInput = z.infer<typeof createPitch.input>

export const createPitch = new Service(
  z.object({
    description: z.string()
  }),
  async ({ description } = {}, author) => {
    if (!author) return null
    const authorId = author.id

    return prisma.pitch.create({
      data: {
        description,
        authorId
      }
    })
  }
)
