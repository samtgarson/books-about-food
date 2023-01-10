import prisma from 'database'
import { FullBook } from 'src/models/book'

export const fetchBook = async (slug: string) => {
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
  return raw && new FullBook(raw)
}
