import type { CollectionAfterChangeHook } from 'payload'
import { extractId } from 'src/core/models/utils/payload-validation'
import { inngest } from 'src/jobs'

/**
 * Sends a book.updated event when the cover image changes.
 * This triggers downstream jobs like palette generation and webp conversion.
 */
export const emitBookUpdatedEvent: CollectionAfterChangeHook = async function ({
  doc,
  previousDoc,
  req
}) {
  const oldId = extractId(previousDoc?.coverImage)
  const newId = extractId(doc?.coverImage)

  const coverImageChanged = !!(newId && oldId !== newId)
  try {
    await inngest.send({
      name: 'book.updated',
      data: {
        id: doc.id,
        coverImageChanged
      }
    })
    req.payload.logger.info(
      `Cover image changed for book ${doc.id}, dispatched book.updated`
    )
  } catch (error) {
    req.payload.logger.error(
      `Failed to dispatch book.updated: ${error instanceof Error ? error.message : String(error)}`
    )
  }

  return doc
}
