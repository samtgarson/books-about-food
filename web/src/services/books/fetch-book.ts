import prisma from 'database'
import { FullBook } from 'src/models/book'
import { Service } from 'src/utils/service'
import { z } from 'zod'

export const fetchBook = new Service(
  z.object({ slug: z.string() }),
  async ({ slug } = {}) => {
    if (!slug) throw new Error('Slug is required')
    const raw = await prisma.book.findUnique({
      where: { slug },
      include: {
        coverImage: true,
        previewImages: true,
        publisher: { include: { logo: true } },
        tags: true,
        contributions: {
          include: {
            profile: { include: { user: { select: { image: true } } } },
            jobs: true
          }
        }
      }
    })
    if (!raw) throw new Error('Book not found')
    return new FullBook(raw)
  }
)
