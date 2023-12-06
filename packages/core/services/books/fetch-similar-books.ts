import { Book } from '@books-about-food/core/models/book'
import { Service } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import { z } from 'zod'
import { bookIncludes } from '../utils'

export const fetchSimilarBooks = new Service(
  z.object({ slug: z.string() }),
  async ({ slug } = {}) => {
    const raw = await prisma.book.findMany({
      where: { tags: { some: { books: { some: { slug } } } }, NOT: { slug } },
      include: bookIncludes
    })

    return raw.map((book) => new Book(book))
  }
)
