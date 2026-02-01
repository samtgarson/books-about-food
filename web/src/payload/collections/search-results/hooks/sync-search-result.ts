import type { PayloadRequest } from 'payload'
import type { SearchResultType } from '../index'

type SourceCollection =
  | 'books'
  | 'profiles'
  | 'publishers'
  | 'tags'
  | 'collections'

export type SearchResultData = {
  name: string
  type: SearchResultType
  slug: string
  description?: string | null
  imageId?: string | null
}

/**
 * Helper to extract ID from a Payload relationship.
 * Handles both populated objects and ID strings.
 */
export function extractRelationId(
  relation: string | { id: string } | null | undefined
): string | null {
  if (!relation) return null
  return typeof relation === 'string' ? relation : relation.id
}

type SyncOptions = {
  req: PayloadRequest
  sourceId: string
  sourceCollection: SourceCollection
  data: SearchResultData | null
}

/**
 * Upserts or deletes a search result entry.
 * Pass data: null to delete the entry.
 */
export async function syncSearchResult({
  req,
  sourceId,
  sourceCollection,
  data
}: SyncOptions): Promise<void> {
  // Delete case: data is null or undefined - remove all entries for this source
  if (!data) {
    await deleteSearchResults({ req, sourceId, sourceCollection })
    return
  }

  // Find existing entry for this source
  const { docs: existing } = await req.payload.find({
    collection: 'search-results',
    where: {
      and: [
        { 'source.value': { equals: sourceId } },
        { 'source.relationTo': { equals: sourceCollection } }
      ]
    },
    limit: 1,
    overrideAccess: true,
    req
  })

  // Prepare payload with polymorphic source relationship
  const searchResultPayload = {
    name: data.name,
    type: data.type,
    slug: data.slug,
    description: data.description || null,
    image: data.imageId || null,
    source: {
      relationTo: sourceCollection,
      value: sourceId
    }
  }

  if (existing[0]) {
    // Update existing entry
    await req.payload.update({
      collection: 'search-results',
      id: existing[0].id,
      data: searchResultPayload,
      overrideAccess: true,
      req
    })
    return
  }

  // Create new entry
  await req.payload.create({
    collection: 'search-results',
    data: searchResultPayload,
    overrideAccess: true,
    req
  })
}

/**
 * Deletes all search results for a given source document.
 * Useful when deleting the source document.
 */
export async function deleteSearchResults({
  req,
  sourceId,
  sourceCollection
}: {
  req: PayloadRequest
  sourceId: string
  sourceCollection: SourceCollection
}): Promise<void> {
  await req.payload.delete({
    collection: 'search-results',
    where: {
      and: [
        { 'source.value': { equals: sourceId } },
        { 'source.relationTo': { equals: sourceCollection } }
      ]
    },
    overrideAccess: true,
    req
  })
}

/**
 * Helper to extract image ID from a Payload image relationship.
 * Handles both populated objects and ID strings.
 */
export function extractImageId(
  image: string | { id: string } | null | undefined
): string | null {
  if (!image) return null
  if (typeof image === 'string') return image
  return image.id
}

/**
 * Fetches profile names for an array of profile relationships.
 * Used for generating book descriptions (author names).
 */
export async function fetchProfileNames(
  req: PayloadRequest,
  profiles: (string | { id: string; name?: string })[] | null | undefined
): Promise<string> {
  if (!profiles || profiles.length === 0) return ''

  // Check if already populated with names
  const populatedProfiles = profiles.filter(
    (p): p is { id: string; name?: string } => typeof p !== 'string' && !!p.name
  )

  if (populatedProfiles.length === profiles.length) {
    return populatedProfiles
      .map((p) => p.name)
      .filter(Boolean)
      .join(' \u2022 ')
  }

  // Need to fetch profile names
  const profileIds = profiles
    .map((p) => (typeof p === 'string' ? p : p.id))
    .filter(Boolean)

  if (profileIds.length === 0) return ''

  const { docs } = await req.payload.find({
    collection: 'profiles',
    where: { id: { in: profileIds } },
    limit: 100,
    depth: 0
  })

  return docs
    .map((p) => p.name)
    .filter(Boolean)
    .join(' \u2022 ')
}
