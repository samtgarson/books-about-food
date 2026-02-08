import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  PayloadRequest
} from 'payload'
import type { Book } from 'src/payload/payload-types'
import { extractRelationId } from '../../search-results/hooks/sync-search-result'

/**
 * Extracts all profile IDs from a book's authors and contributions.
 */
function getProfileIds(doc: Book): string[] {
  const profileIds: string[] = []

  if (doc.authors && Array.isArray(doc.authors)) {
    for (const author of doc.authors) {
      const id = extractRelationId(author)
      if (id) profileIds.push(id)
    }
  }

  if (doc.contributions && Array.isArray(doc.contributions)) {
    for (const contribution of doc.contributions) {
      const id = extractRelationId(contribution.profile)
      if (id) profileIds.push(id)
    }
  }

  return [...new Set(profileIds)]
}

/**
 * Syncs a profile's search result by triggering its afterChange hook.
 */
async function syncProfile(
  req: PayloadRequest,
  profileId: string
): Promise<void> {
  try {
    const profile = await req.payload.findByID({
      collection: 'profiles',
      id: profileId,
      depth: 0,
      req
    })
    if (profile) {
      // Update profile to trigger the afterChange hook
      await req.payload.update({
        collection: 'profiles',
        id: profileId,
        data: { name: profile.name },
        req
      })
    }
  } catch {
    // Profile may have been deleted, ignore
  }
}

/**
 * When a book changes, we may need to update the search results for related
 * profiles and publishers.
 *
 * This is because:
 * - Profiles are only in search if they have published books
 * - Publishers are only in search if they have published books
 *
 * This hook triggers when:
 * - Book status changes (published/unpublished)
 * - Book authors change
 * - Book contributions change
 * - Book publisher changes
 */
export const syncRelatedSearchResults: CollectionAfterChangeHook<
  Book
> = async ({ doc, previousDoc, req }) => {
  const statusChanged = doc.status !== previousDoc?.status

  // Get current and previous profile/publisher IDs
  const currentProfileIds = getProfileIds(doc)
  const previousProfileIds = previousDoc ? getProfileIds(previousDoc) : []

  const currentPublisherId = extractRelationId(doc.publisher)
  const previousPublisherId = previousDoc
    ? extractRelationId(previousDoc.publisher)
    : null

  // Check what changed
  const profilesChanged =
    JSON.stringify(currentProfileIds.sort()) !==
    JSON.stringify(previousProfileIds.sort())
  const publisherChanged = currentPublisherId !== previousPublisherId

  // If nothing relevant changed, skip
  if (!statusChanged && !profilesChanged && !publisherChanged) {
    return doc
  }

  // Get all profile IDs that need to be synced (union of current and previous)
  const allProfileIds = [
    ...new Set([...currentProfileIds, ...previousProfileIds])
  ]

  // Sync all affected profiles
  for (const profileId of allProfileIds) {
    await syncProfile(req, profileId)
  }

  // Sync current publisher
  if (currentPublisherId) {
    try {
      const publisher = await req.payload.findByID({
        collection: 'publishers',
        id: currentPublisherId,
        depth: 0,
        req
      })
      if (publisher) {
        await req.payload.update({
          collection: 'publishers',
          id: currentPublisherId,
          data: { name: publisher.name },
          req
        })
      }
    } catch {
      // Publisher may have been deleted, ignore
    }
  }

  // Also sync previous publisher if it changed
  if (publisherChanged && previousPublisherId) {
    try {
      const publisher = await req.payload.findByID({
        collection: 'publishers',
        id: previousPublisherId,
        depth: 0,
        req
      })
      if (publisher) {
        await req.payload.update({
          collection: 'publishers',
          id: previousPublisherId,
          data: { name: publisher.name },
          req
        })
      }
    } catch {
      // Publisher may have been deleted, ignore
    }
  }

  return doc
}

/**
 * Syncs a publisher's search result by triggering its afterChange hook.
 */
async function syncPublisher(
  req: PayloadRequest,
  publisherId: string
): Promise<void> {
  try {
    const publisher = await req.payload.findByID({
      collection: 'publishers',
      id: publisherId,
      depth: 0,
      req
    })
    if (publisher) {
      await req.payload.update({
        collection: 'publishers',
        id: publisherId,
        data: { name: publisher.name },
        req
      })
    }
  } catch {
    // Publisher may have been deleted, ignore
  }
}

/**
 * When a book is deleted, we need to update the search results for related
 * profiles and publishers, as this may have been their last published book.
 */
export const syncRelatedSearchResultsOnDelete: CollectionAfterDeleteHook<
  Book
> = async ({ doc, req }) => {
  const profileIds = getProfileIds(doc)
  const publisherId = extractRelationId(doc.publisher)

  // Sync all profiles that were associated with this book
  for (const profileId of profileIds) {
    await syncProfile(req, profileId)
  }

  // Sync publisher if there was one
  if (publisherId) {
    await syncPublisher(req, publisherId)
  }

  return doc
}
