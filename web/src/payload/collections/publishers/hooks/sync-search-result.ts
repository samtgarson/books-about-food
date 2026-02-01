import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook
} from 'payload'
import type { Publisher } from 'src/payload/payload-types'
import {
  deleteSearchResults,
  extractImageId,
  syncSearchResult
} from '../../search-results/hooks/sync-search-result'

/**
 * Syncs publisher data to search-results collection.
 * Only publishers with published books are included.
 */
export const syncPublisherSearchResult: CollectionAfterChangeHook<
  Publisher
> = async ({ doc, req }) => {
  // Check if publisher has any published books
  const { totalDocs: publishedBookCount } = await req.payload.find({
    collection: 'books',
    where: {
      and: [
        { publisher: { equals: doc.id } },
        { status: { equals: 'published' } }
      ]
    },
    limit: 0
  })

  if (publishedBookCount === 0) {
    // Remove from search results if no published books
    await deleteSearchResults({
      req,
      sourceId: doc.id,
      sourceCollection: 'publishers'
    })
    return doc
  }

  await syncSearchResult({
    req,
    sourceId: doc.id,
    sourceCollection: 'publishers',
    data: {
      name: doc.name,
      type: 'publisher',
      slug: doc.slug,
      description: null,
      imageId: extractImageId(doc.logo)
    }
  })

  return doc
}

/**
 * Removes publisher from search results when deleted.
 */
export const deletePublisherSearchResult: CollectionAfterDeleteHook<
  Publisher
> = async ({ doc, req }) => {
  await deleteSearchResults({
    req,
    sourceId: doc.id,
    sourceCollection: 'publishers'
  })
  return doc
}
