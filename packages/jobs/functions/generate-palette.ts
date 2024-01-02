import { inngest } from '@books-about-food/core/jobs'
import prisma from '@books-about-food/database'
import { wrapArray } from '@books-about-food/shared/utils/array'
import { asyncBatch } from '@books-about-food/shared/utils/batch'
import { generateBookPalette } from '../lib/generate-palette'
import { JobResult } from '../types'

export const generatePalette = inngest.createFunction(
  {
    id: 'generate-palette',
    name: 'Generate Book Palette',
    concurrency: { limit: 5 }
  },
  { event: 'book.updated', if: 'event.data.coverImageChanged == true' },
  async ({ event }) => {
    const { id } = event.data
    const ids = id === 'all' ? await allIds() : wrapArray(id)

    const results = await asyncBatch(ids, 5, async (id) => {
      try {
        return await generateBookPalette(id)
      } catch (error) {
        console.error(id, (error as Error).message)
        return {
          status: 'failed',
          message: (error as Error).message
        } as JobResult
      }
    })
    const success = results.filter(
      (result) => result.status === 'success'
    ).length
    return {
      success: success === results.length,
      successCount: success,
      results
    }
  }
)

async function allIds() {
  const records = await prisma.book.findMany({
    select: { id: true },
    where: { status: 'published' }
  })

  return records.map((record) => record.id)
}
