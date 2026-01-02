import prisma from '@books-about-food/database'
import { AuthedService } from 'src/core/services/base'
import { z } from 'zod'

export const updateLinks = new AuthedService(
  z.object({
    slug: z.string(),
    links: z
      .object({
        site: z.string(),
        url: z.string()
      })
      .array()
  }),
  async ({ slug, links }, _ctx) => {
    const book = await prisma.book.findUnique({
      where: { slug },
      include: { contributions: true }
    })
    if (!book) throw new Error('Book not found')

    await prisma.book.update({
      where: { slug },
      data: {
        links: {
          deleteMany: { bookId: book.id },
          create: links
        }
      }
    })
  }
)
