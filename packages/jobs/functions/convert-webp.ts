import { inngest } from '@books-about-food/core/jobs'
import { createImages } from '@books-about-food/core/services/images/create-images'
import { FileUploader } from '@books-about-food/core/services/images/file-uploader'
import prisma from '@books-about-food/database'
import { wrapArray } from '@books-about-food/shared/utils/array'
import { asyncBatch } from '@books-about-food/shared/utils/batch'
import { imageUrl } from '@books-about-food/shared/utils/image-url'
import { RetryAfterError } from 'inngest'
import sharp from 'sharp'
import { JobResult } from '../types'

const uploader = new FileUploader()

export const convertWebp = inngest.createFunction(
  {
    id: 'convert-webp',
    name: 'Convert webp covers to png',
    concurrency: { limit: 2 },
    retries: 2
  },
  { event: 'book.updated', if: 'event.data.coverImageChanged == true' },
  async ({ event, step }) => {
    const { id } = event.data
    const ids = wrapArray(id)

    const results = await asyncBatch(ids, 2, async (id) => {
      try {
        return await convertCover(id)
      } catch (error) {
        console.error(id, (error as Error).message)
        return {
          id,
          status: 'failed',
          message: (error as Error).message
        } as JobResult
      }
    })

    const updatedIds = results
      .filter((result) => result.status === 'success')
      .map(({ id }) => id)

    if (updatedIds.length > 0) {
      await step.sendEvent('book-updated', {
        name: 'book.updated',
        data: { id: updatedIds, coverImageChanged: true }
      })
    }

    const failedCount = results.filter(
      (result) => result.status === 'failed'
    ).length
    if (failedCount > 0) {
      throw new RetryAfterError('Some covers failed to convert', '1m')
    }

    return { success: true, results }
  }
)

async function convertCover(id: string): Promise<JobResult> {
  const book = await prisma.book.findUnique({
    where: { id },
    include: { coverImage: true }
  })
  const oldCover = book?.coverImage
  if (!oldCover) return { id, status: 'skipped', message: 'No cover found' }
  if (!oldCover.path.endsWith('.webp'))
    return { id, status: 'skipped', message: 'Cover is not webp' }

  const res = await fetch(imageUrl(oldCover.path))
  if (!res.ok) return { id, status: 'failed', message: 'Failed to fetch cover' }
  const buffer = await res.arrayBuffer()

  const pngBuffer = await sharp(buffer).png({ force: true }).toBuffer()

  const createRes = await createImages.call({
    prefix: `books/${book.id}/cover`,
    files: [{ buffer: pngBuffer, type: 'image/png' }]
  })
  if (!createRes.success)
    return {
      id,
      status: 'failed',
      message: `Failed to create cover: ${createRes.errors}`
    }

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
  return { id, status: 'success' }
}
