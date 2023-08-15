import prisma, { cacheStrategy } from 'database'
import { FullBook } from 'src/models/full-book'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { bookIncludes } from '../utils'

export const fetchBook = new Service(
  z.object({ slug: z.string() }),
  async ({ slug } = {}) => {
    if (!slug) throw new Error('Slug is required')
    const raw = await prisma.book.findUnique({
      where: { slug },
      include: bookIncludes,
      cacheStrategy
    })

    if (!raw) {
      throw new Error('Book not found')
    }

    return new FullBook(raw)
  }
)
