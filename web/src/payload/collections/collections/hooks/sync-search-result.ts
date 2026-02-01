import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook
} from 'payload'
import type { Collection } from 'src/payload/payload-types'
import {
  deleteSearchResults,
  syncSearchResult
} from '../../search-results/hooks/sync-search-result'

/**
 * Syncs collection data to search-results collection.
 * All collections are included (no filtering by status).
 */
export const syncCollectionSearchResult: CollectionAfterChangeHook<
  Collection
> = async ({ doc, req }) => {
  await syncSearchResult({
    req,
    sourceId: doc.id,
    sourceCollection: 'collections',
    data: {
      name: doc.title,
      type: 'collection',
      slug: doc.slug,
      description: doc.description || null,
      imageId: null
    }
  })

  return doc
}

/**
 * Removes collection from search results when deleted.
 */
export const deleteCollectionSearchResult: CollectionAfterDeleteHook<
  Collection
> = async ({ doc, req }) => {
  await deleteSearchResults({
    req,
    sourceId: doc.id,
    sourceCollection: 'collections'
  })
  return doc
}
