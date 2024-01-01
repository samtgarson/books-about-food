import prisma from '@books-about-food/database'
import { imageUrl } from '@books-about-food/shared/utils/image-url'
import { JobResult } from '../../types'
import { getColors } from './get-colors'

export async function generateBookPalette(id: string): Promise<JobResult> {
  const image = await prisma.image.findUnique({
    where: { coverForId: id }
  })

  if (!image) return { id, status: 'skipped', message: 'No cover found' }
  if (image.path.endsWith('.webp'))
    return { id, status: 'skipped', message: 'Cover is webp' }

  const src = imageUrl(image.path)
  const { palette, backgroundColor } = await getColors(src)

  await prisma.book.update({
    where: { id: id },
    data: { backgroundColor, palette }
  })

  return { id, status: 'success' }
}
