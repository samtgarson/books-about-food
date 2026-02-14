import type { Payload } from 'payload'
import { inngest } from 'src/jobs'
import { wrapArray } from '../../utils/array'
import { asyncBatch } from '../../utils/batch'
import { generateBookPalette } from '../lib/generate-palette'
import type { JobResult } from '../types'

export const generatePalette = inngest.createFunction(
  {
    id: 'generate-palette',
    name: 'Generate Book Palette',
    concurrency: { limit: 5 }
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
    const ids = id === 'all' ? await allIds(payload) : wrapArray(id)

    const results = await asyncBatch(ids, 5, async (id) => {
      try {
        return await generateBookPalette(payload, id)
      } catch (error) {
        console.error(id, (error as Error).message)
        return {
          id,
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

async function allIds(payload: Payload) {
  const { docs } = await payload.find({
    collection: 'books',
    where: { status: { equals: 'published' } },
    limit: 0,
    depth: 0
  })
  return docs.map((doc) => doc.id)
}
