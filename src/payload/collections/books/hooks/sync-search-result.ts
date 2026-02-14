import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook
} from 'payload'
import type { Book } from 'src/payload/payload-types'
import {
  deleteSearchResults,
  extractImageId,
  fetchProfileNames,
  syncSearchResult
} from '../../search-results/hooks/sync-search-result'

/**
 * Syncs book data to search-results collection.
 * Only published books are included in search results.
 */
export const syncBookSearchResult: CollectionAfterChangeHook<Book> = async ({
  doc,
  req
}) => {
  const isPublished = doc.status === 'published'

  if (!isPublished) {
    // Remove from search results if not published
    await deleteSearchResults({
      req,
      sourceId: doc.id,
      sourceCollection: 'books'
    })
    return doc
  }

  // Get author names for description
  const authorNames = await fetchProfileNames(req, doc.authors)

  await syncSearchResult({
    req,
    sourceId: doc.id,
    sourceCollection: 'books',
    data: {
      name: doc.title,
      type: 'book',
      slug: doc.slug,
      description: authorNames || null,
      imageId: extractImageId(doc.coverImage)
    }
  })

  return doc
}

/**
 * Removes book from search results when deleted.
 */
export const deleteBookSearchResult: CollectionAfterDeleteHook<Book> = async ({
  doc,
  req
}) => {
  await deleteSearchResults({
    req,
    sourceId: doc.id,
    sourceCollection: 'books'
  })
  return doc
}
