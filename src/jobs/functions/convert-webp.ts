import { RetryAfterError } from 'inngest'
import type { Payload } from 'payload'
import sharp from 'sharp'
import { FileUploader } from 'src/core/services/images/file-uploader'
import { inngest } from 'src/jobs'
import { wrapArray } from '../../utils/array'
import { asyncBatch } from '../../utils/batch'
import { imageUrl } from '../../utils/image-url'
import type { JobResult } from '../types'

const uploader = new FileUploader()

export const convertWebp = inngest.createFunction(
  {
    id: 'convert-webp',
    name: 'Convert webp covers to png',
    concurrency: { limit: 2 },
    retries: 2
  },
  { event: 'book.updated', if: 'event.data.coverImageChanged == true' },
  async ({
    event,
    payload
  }: {
    event: { data: { id: string | string[] } }
    payload: Payload
  }) => {
    const { id } = event.data
    const ids = wrapArray(id)

    const results = await asyncBatch(ids, 2, async (id) => {
      try {
        return await convertCover(payload, id)
      } catch (error) {
        console.error(id, (error as Error).message)
        return {
          id,
          status: 'failed',
          message: (error as Error).message
        } as JobResult
      }
    })

    const failedCount = results.filter(
      (result) => result.status === 'failed'
    ).length
    if (failedCount > 0) {
      throw new RetryAfterError('Some covers failed to convert', '1m')
    }

    return { success: true, results }
  }
)

async function convertCover(payload: Payload, id: string): Promise<JobResult> {
  const book = await payload.findByID({
    collection: 'books',
    id,
    depth: 1
  })

  const oldCover =
    typeof book.coverImage === 'object' ? book.coverImage : undefined
  if (!oldCover?.filename)
    return { id, status: 'skipped', message: 'No cover found' }
  if (!oldCover.filename.endsWith('.webp'))
    return { id, status: 'skipped', message: 'Cover is not webp' }

  const res = await fetch(
    imageUrl(oldCover.filename, oldCover.prefix as string)
  )
  if (!res.ok) return { id, status: 'failed', message: 'Failed to fetch cover' }
  const buffer = await res.arrayBuffer()

  const pngBuffer = await sharp(buffer).png({ force: true }).toBuffer()

  const newCover = await payload.create({
    collection: 'images',
    data: {},
    file: {
      data: pngBuffer,
      size: pngBuffer.byteLength,
      name: 'cover.png',
      mimetype: 'image/png'
    }
  })

  await payload.update({
    collection: 'books',
    id: book.id,
    data: { coverImage: newCover.id }
  })

  await payload.delete({
    collection: 'images',
    id: oldCover.id
  })

  await uploader.delete(oldCover.filename)
  return { id, status: 'success' }
}
