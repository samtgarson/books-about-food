import prisma from '@books-about-food/database'
import { imageUrl } from '@books-about-food/shared/utils/image-url'
import { getColors } from './get-colors'

export async function generateBookPalette(bookId: string) {
  console.log('Generating palette for book', bookId)
  const image = await prisma.image.findUnique({
    where: { coverForId: bookId }
  })

  if (!image || image.path.endsWith('.webp')) return true

  const src = imageUrl(image.path)
  const { palette, backgroundColor } = await getColors(src)

  await prisma.book.update({
    where: { id: bookId },
    data: { backgroundColor, palette }
  })

  return true
}
