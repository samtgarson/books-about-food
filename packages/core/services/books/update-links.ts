import { Service } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import { z } from 'zod'

export const updateLinks = new Service(
  z.object({
    slug: z.string(),
    links: z
      .object({
        site: z.string(),
        url: z.string()
      })
      .array()
  }),
  async ({ slug, links } = [], user) => {
    if (!user) throw new Error('User is required')
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
