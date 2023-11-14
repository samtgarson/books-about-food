import { generateBookPalette } from '@books-about-food/core/services/books/generate-book-palette'
import prisma from '@books-about-food/database'
import { inngest } from '..'

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

      const user =
        event.user.id &&
        (await prisma.user.findUnique({ where: { id: event.user.id } }))
      const result = await generateBookPalette.call(
        { bookId: event.data.id },
        user
      )
      return { event, success: !!result.data }
    } catch (error) {
      return { event, success: false, error: (error as Error).message }
    }
  }
)
