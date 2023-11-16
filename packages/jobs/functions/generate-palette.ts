import { generateBookPalette } from '../lib/generate-book-palette'
import { createJob } from './base'

export const generatePalette = createJob(
  {
    id: 'generate-palette',
    name: 'Generate Book Palette',
    concurrency: { limit: 10 }
  },
  'book.updated',
  async ({ event }) => {
    if (!event.data.coverImageChanged)
      return {
        success: true,
        status: 'skipped: cover image not changed'
      }

    const success = await generateBookPalette(event.data.id)
    return { success }
  }
)
