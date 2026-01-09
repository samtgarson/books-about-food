import {
  BasePayload,
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook
} from 'payload'
import { extractId } from 'src/core/models/utils/payload-validation'
import { Book } from 'src/payload/payload-types'

export function updatePublisherBookCountAfterChange({
  doc,
  previousDoc,
  req
}: Parameters<CollectionAfterChangeHook<Book>>[0]) {
  const { payload } = req

  const currentPublisherId = extractId(doc.publisher)
  const previousPublisherId = previousDoc
    ? extractId(previousDoc.publisher)
    : undefined

  return updatePublisherBookCount(
    currentPublisherId,
    previousPublisherId,
    payload
  )
}

export function updatePublisherBookCountAfterDelete({
  doc,
  req
}: Parameters<CollectionAfterDeleteHook<Book>>[0]) {
  const { payload } = req
  const previousPublisherId = extractId(doc.publisher)

  return updatePublisherBookCount(undefined, previousPublisherId, payload)
}

/**
 * Updates the publishedBooksCount on the publisher when a book's status or publisher changes
 */
export async function updatePublisherBookCount(
  currentPublisherId: string | undefined,
  previousPublisherId: string | undefined,
  payload: BasePayload
) {
  const publishersToUpdate = new Set<string>()

  // If publisher changed, update both old and new
  if (previousPublisherId && previousPublisherId !== currentPublisherId) {
    publishersToUpdate.add(previousPublisherId)
  }
  if (currentPublisherId) {
    publishersToUpdate.add(currentPublisherId)
  }

  // Update count for each affected publisher
  await Promise.all(
    Array.from(publishersToUpdate).map(async function (publisherId) {
      const { totalDocs } = await payload.count({
        collection: 'books',
        where: {
          and: [
            { publisher: { equals: publisherId } },
            { status: { equals: 'published' } }
          ]
        }
      })

      await payload.update({
        collection: 'publishers',
        id: publisherId,
        data: {
          publishedBooksCount: totalDocs
        },
        depth: 0
      })
    })
  )
}
