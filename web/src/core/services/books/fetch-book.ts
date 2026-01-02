import { Where } from 'payload'
import { FullBook } from 'src/core/models/full-book'
import { Service } from 'src/core/services/base'
import { FULL_BOOK_DEPTH } from 'src/core/services/utils/payload-depth'
import { z } from 'zod'

export const fetchBook = new Service(
  z.object({
    slug: z.string(),
    onlyPublished: z.boolean().optional()
  }),
  async ({ slug, onlyPublished }, { payload }) => {
    if (!slug) throw new Error('Slug is required')

    const where: Where = { slug: { equals: slug } }
    if (onlyPublished) {
      where.status = { equals: 'published' }
    }

    const { docs } = await payload.find({
      collection: 'books',
      where,
      limit: 1,
      depth: FULL_BOOK_DEPTH
    })

    if (!docs[0]) {
      throw new Error('Book not found')
    }

    return new FullBook(docs[0])
  }
)
