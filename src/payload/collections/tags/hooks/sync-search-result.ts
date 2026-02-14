import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook
} from 'payload'
import type { Tag } from 'src/payload/payload-types'
import {
  deleteSearchResults,
  syncSearchResult
} from '../../search-results/hooks/sync-search-result'

/**
 * Syncs tag data to search-results collection.
 * All tags are included (no filtering).
 */
export const syncTagSearchResult: CollectionAfterChangeHook<Tag> = async ({
  doc,
  req
}) => {
  await syncSearchResult({
    req,
    sourceId: doc.id,
    sourceCollection: 'tags',
    data: {
      name: doc.name,
      type: 'bookTag',
      slug: doc.slug,
      description: null,
      imageId: null
    }
  })

  return doc
}

/**
 * Removes tag from search results when deleted.
 */
export const deleteTagSearchResult: CollectionAfterDeleteHook<Tag> = async ({
  doc,
  req
}) => {
  await deleteSearchResults({
    req,
    sourceId: doc.id,
    sourceCollection: 'tags'
  })
  return doc
}
