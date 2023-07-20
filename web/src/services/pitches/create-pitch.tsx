import prisma from 'database'
import { Service } from 'src/utils/service'
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
