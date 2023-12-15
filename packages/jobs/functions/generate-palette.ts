import prisma from '@books-about-food/database'
import { wrapArray } from '@books-about-food/shared/utils/array'
import { asyncBatch } from '@books-about-food/shared/utils/batch'
import { inngest } from '..'
import { generateBookPalette } from '../lib/generate-palette'

export const generatePalette = inngest.createFunction(
  {
    id: 'generate-palette',
    name: 'Generate Book Palette',
    concurrency: { limit: 5 }
  },
  { event: 'book.updated' },
  async ({ event }) => {
    if (!event.data.coverImageChanged)
      return {
        success: true,
        status: 'skipped: cover image not changed'
      }

    const { id } = event.data
    const ids = id === 'all' ? await allIds() : wrapArray(id)

    const results = await asyncBatch(ids, 5, async (id) => {
      try {
        return await generateBookPalette(id)
      } catch (error) {
        console.error(id, (error as Error).message)
        return false
      }
    })
    const success = results.filter((result) => result === true).length
    return { success: success === results.length, successCount: success }
  }
)

async function allIds() {
  const records = await prisma.book.findMany({
    select: { id: true },
    where: { status: 'published' }
  })

  return records.map((record) => record.id)
}
