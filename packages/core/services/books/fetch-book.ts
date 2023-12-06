import { FullBook } from '@books-about-food/core/models/full-book'
import { Service } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import { z } from 'zod'
import { fullBookIncludes } from '../utils/includes'

export const fetchBook = new Service(
  z.object({ slug: z.string(), cache: z.boolean().optional() }),
  async ({ slug } = {}) => {
    if (!slug) throw new Error('Slug is required')
    const raw = await prisma.book.findUnique({
      where: { slug },
      include: fullBookIncludes
    })

    if (!raw) {
      throw new Error('Book not found')
    }

    return new FullBook(raw)
  }
)
