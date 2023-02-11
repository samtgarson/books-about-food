import prisma from 'database'
import { FullBook } from 'src/models/full-book'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { profileIncludes } from '../utils'

export const fetchBook = new Service(
  z.object({ slug: z.string() }),
  async ({ slug } = {}) => {
    if (!slug) throw new Error('Slug is required')
    const raw = await prisma.book.findUnique({
      where: { slug },
      include: {
        coverImage: true,
        previewImages: { orderBy: { createdAt: 'asc' } },
        publisher: { include: { logo: true } },
        tags: true,
        links: true,
        contributions: {
          distinct: ['profileId'],
          include: {
            profile: profileIncludes,
            job: true
          }
        }
      }
    })
    if (!raw) throw new Error('Book not found')
    return new FullBook(raw)
  }
)
