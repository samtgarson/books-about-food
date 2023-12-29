import { inngest } from '@books-about-food/core/jobs'
import { createImages } from '@books-about-food/core/services/images/create-images'
import { FileUploader } from '@books-about-food/core/services/images/file-uploader'
import prisma from '@books-about-food/database'
import { wrapArray } from '@books-about-food/shared/utils/array'
import { asyncBatch } from '@books-about-food/shared/utils/batch'
import { imageUrl } from '@books-about-food/shared/utils/image-url'
import sharp from 'sharp'

const uploader = new FileUploader()

export const convertWebp = inngest.createFunction(
  {
    id: 'convert-webp',
    name: 'Convert webp covers to png',
    concurrency: { limit: 2 }
  },
  { event: 'book.updated', if: 'event.data.coverImageChanged == true' },
  async ({ event, step }) => {
    const { id } = event.data
    const ids = wrapArray(id)

    const res = await asyncBatch(ids, 2, async (id) => {
      try {
        const success = await convertCover(id)
        return { id, success }
      } catch (error) {
        console.error(id, (error as Error).message)
        return { id, success: false }
      }
    })

    const updatedIds = res
      .filter((result) => result.success)
      .map(({ id }) => id)

    if (updatedIds.length > 0) {
      await step.sendEvent('book-updated', {
        name: 'book.updated',
        data: { id: updatedIds, coverImageChanged: true }
      })
    }

    return { success: true, successCount: updatedIds.length }
  }
)

async function convertCover(id: string) {
  const book = await prisma.book.findUnique({
    where: { id },
    include: { coverImage: true }
  })
  const oldCover = book?.coverImage
  if (!oldCover || !oldCover.path.endsWith('.webp')) return

  const res = await fetch(imageUrl(oldCover.path))
  if (!res.ok) return
  const buffer = await res.arrayBuffer()

  const pngBuffer = await sharp(buffer).png({ force: true }).toBuffer()

  const createRes = await createImages.call({
    prefix: `books/${book.id}/cover`,
    files: [{ buffer: pngBuffer, type: 'image/png' }]
  })
  if (!createRes.success) return

  const {
    data: [newCover]
  } = createRes

  await prisma.$transaction([
    prisma.image.delete({ where: { id: oldCover.id } }),
    prisma.image.update({
      where: { id: newCover.id },
      data: { coverForId: book.id }
    })
  ])

  await uploader.delete(oldCover.path)
  return true
}
