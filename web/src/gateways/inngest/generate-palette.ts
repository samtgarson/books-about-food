import prisma from 'database'
import { inngest } from 'src/gateways/inngest'
import { generateBookPalette } from 'src/services/books/generate-book-palette'

export const generatePalette = inngest.createFunction(
  {
    id: 'generate-palette',
    name: 'Generate Palette',
    concurrency: { limit: 10 }
  },
  { event: 'book.updated' },
  async ({ event }) => {
    if (!event.user.id) return
    if (!event.data.input.coverImageId) return

    const user = await prisma.user.findUnique({ where: { id: event.user.id } })
    const result = await generateBookPalette.call(
      { bookId: event.data.id },
      user
    )
    return { event, success: !!result.data }
  }
)
