import prisma from 'database'
import { slugify } from 'shared/utils/slugify'
import { Service } from 'src/utils/service'
import { z } from 'zod'

export const createBook = new Service(
  z.object({
    title: z.string()
  }),
  async ({ title } = {}, user) => {
    if (!user) throw new Error('User is required')

    return prisma.book.create({
      data: { title, slug: slugify(title), submitterId: user.id }
    })
  }
)
