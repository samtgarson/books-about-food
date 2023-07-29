import prisma from 'database'
import { FullBook } from 'src/models/full-book'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { bookIncludes } from '../utils'

export const fetchBook = new Service(
  z.object({ slug: z.string(), submitterId: z.string().optional() }),
  async ({ slug, submitterId } = {}) => {
    if (!slug) throw new Error('Slug is required')
    const raw = await prisma.book.findUnique({
      where: { slug },
      include: bookIncludes
    })

    // TODO Move this to where clause in Prisma 5
    const wrongSubmitter = submitterId && raw?.submitterId !== submitterId

    if (!raw || wrongSubmitter) {
      throw new Error('Book not found')
    }

    return new FullBook(raw)
  }
)
