import prisma, { cacheStrategy } from 'database'
import { Book } from 'src/models/book'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { bookIncludes } from '../utils'

export const fetchSimilarBooks = new Service(
  z.object({ slug: z.string() }),
  async ({ slug } = {}) => {
    const raw = await prisma.book.findMany({
      where: { tags: { some: { books: { some: { slug } } } }, NOT: { slug } },
      include: bookIncludes,
      cacheStrategy
    })

    return raw.map((book) => new Book(book))
  }
)
