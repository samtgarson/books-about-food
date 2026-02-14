import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook
} from 'payload'
import type { Profile } from 'src/payload/payload-types'
import {
  deleteSearchResults,
  extractImageId,
  syncSearchResult
} from '../../search-results/hooks/sync-search-result'

/**
 * Syncs profile data to search-results collection.
 * Only profiles with published books are included.
 * Profiles are classified as 'author' or 'contributor' based on their role.
 */
export const syncProfileSearchResult: CollectionAfterChangeHook<
  Profile
> = async ({ doc, req }) => {
  // Check if profile has any published books (as author or contributor)
  const { totalDocs: bookCount } = await req.payload.find({
    collection: 'books',
    where: {
      and: [
        {
          or: [
            { authors: { contains: doc.id } },
            { 'contributions.profile': { equals: doc.id } }
          ]
        },
        { status: { equals: 'published' } }
      ]
    },
    limit: 0
  })

  if (bookCount === 0) {
    // Remove from search results if no published books
    await deleteSearchResults({
      req,
      sourceId: doc.id,
      sourceCollection: 'profiles'
    })
    return doc
  }

  await syncSearchResult({
    req,
    sourceId: doc.id,
    sourceCollection: 'profiles',
    data: {
      name: doc.name,
      type: 'profile',
      slug: doc.slug,
      description: doc.jobTitle || null,
      imageId: extractImageId(doc.avatar)
    }
  })

  return doc
}

/**
 * Removes profile from search results when deleted.
 */
export const deleteProfileSearchResult: CollectionAfterDeleteHook<
  Profile
> = async ({ doc, req }) => {
  await deleteSearchResults({
    req,
    sourceId: doc.id,
    sourceCollection: 'profiles'
  })
  return doc
}
