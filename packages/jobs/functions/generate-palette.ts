import { inngest } from '..'
import { generateBookPalette } from '../lib/generate-book-palette'

export const generatePalette = inngest.createFunction(
  {
    id: 'generate-palette',
    name: 'Generate Palette',
    concurrency: { limit: 10 }
  },
  { event: 'book.updated' },
  async ({ event }) => {
    try {
      if (!event.data.coverImageChanged)
        return {
          event,
          success: true,
          status: 'skipped: cover image not changed'
        }

      const success = await generateBookPalette(event.data.id)
      return { event, success }
    } catch (error) {
      console.error(error)
      return { event, success: false, error: (error as Error).message }
    }
  }
)
