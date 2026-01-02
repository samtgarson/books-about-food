import type { FieldHook } from 'payload'
import { inngest } from 'src/core/jobs'
import type { Book } from '../../../payload-types'

/**
 * Field hook to trigger palette generation when cover image changes.
 * Sends a book.updated event to Inngest with coverImageChanged: true.
 */
export const triggerPaletteGeneration: FieldHook<
  Book,
  string | undefined
> = async ({ value, previousValue, originalDoc: { id: bookId } = {}, req }) => {
  if (value && previousValue !== value && bookId) {
    try {
      await inngest.send({
        name: 'book.updated',
        data: {
          id: bookId,
          coverImageChanged: true
        }
      })
      req.payload.logger.info(`Triggered palette generation for book ${bookId}`)
    } catch (error) {
      req.payload.logger.error(
        `Failed to trigger palette generation: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  return value
}
