import prisma from '@books-about-food/database'
import { FullBook } from 'src/core/models/full-book'
import { Service } from 'src/core/services/base'
import { z } from 'zod'
import { fullBookIncludes } from '../utils/includes'

export const fetchBook = new Service(
  z.object({
    slug: z.string(),
    onlyPublished: z.boolean().optional()
  }),
  async ({ slug, onlyPublished }, _ctx) => {
    if (!slug) throw new Error('Slug is required')
    const raw = await prisma.book.findUnique({
      where: { slug, status: onlyPublished ? 'published' : undefined },
      include: fullBookIncludes
    })

    if (!raw) {
      throw new Error('Book not found')
    }

    return new FullBook(raw)
  }
)
