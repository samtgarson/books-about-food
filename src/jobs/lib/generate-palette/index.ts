import type { Payload } from 'payload'
import { imageUrl } from '../../../utils/image-url'
import type { JobResult } from '../../types'
import { getColors } from './get-colors'

export async function generateBookPalette(
  payload: Payload,
  id: string
): Promise<JobResult> {
  const book = await payload.findByID({
    collection: 'books',
    id,
    depth: 1
  })

  if (!book) return { id, status: 'skipped', message: 'Book not found' }

  const cover =
    typeof book.coverImage === 'object' ? book.coverImage : undefined
  if (!cover?.filename)
    return { id, status: 'skipped', message: 'No cover found' }
  if (cover.filename.endsWith('.webp'))
    return { id, status: 'skipped', message: 'Cover is webp' }

  const src = imageUrl(cover.filename, cover.prefix as string)
  const { palette, backgroundColor } = await getColors(src)

  await payload.update({
    collection: 'books',
    id,
    data: {
      backgroundColor,
      palette: palette.map((color) => ({ color }))
    }
  })

  return { id, status: 'success' }
}
