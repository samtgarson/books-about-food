import prisma from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { fetchBook } from './fetch-book'

export const updateBook = new Service(
  z.object({
    slug: z.string(),
    title: z.string().optional(),
    subtitle: z.string().optional()
  }),
  async ({ slug, ...data } = {}, user) => {
    if (!slug) throw new Error('Slug is required')
    if (!user) throw new Error('User is required')

    // TODO Move this to where clause in Prisma 5
    const book = await fetchBook.call({ slug }, user)
    if (book.submitterId !== user.id) {
      throw new Error('You do not have permission to edit this book')
    }

    await prisma.book.update({
      where: { slug },
      data
    })

    return true
  }
)
