import type { CollectionBeforeChangeHook } from 'payload'
import type { Book } from 'src/payload/payload-types'

/**
 * Update the searchText field with all searchable content from the book
 * This includes: title, subtitle, publisher name, tag names, author names, and contributor names
 */
export const updateSearchText: CollectionBeforeChangeHook<Book> = async ({
  data,
  req
}) => {
  const searchableParts: string[] = []

  // Add book title and subtitle
  if (data.title) searchableParts.push(data.title)
  if (data.subtitle) searchableParts.push(data.subtitle)

  // Add publisher name
  if (data.publisher) {
    const publisherId =
      typeof data.publisher === 'string' ? data.publisher : data.publisher.id

    if (publisherId) {
      const publisher = await req.payload.findByID({
        collection: 'publishers',
        id: publisherId,
        depth: 0
      })
      if (publisher?.name) {
        searchableParts.push(publisher.name)
      }
    }
  }

  // Add tag names
  if (data.tags && Array.isArray(data.tags) && data.tags.length > 0) {
    const tagIds = data.tags
      .map((tag) => (typeof tag === 'string' ? tag : tag.id))
      .filter((id): id is string => !!id)

    if (tagIds.length > 0) {
      const { docs: tags } = await req.payload.find({
        collection: 'tags',
        where: {
          id: {
            in: tagIds
          }
        },
        depth: 0,
        limit: 100,
        pagination: false
      })
      tags.forEach((tag) => {
        if (tag.name) searchableParts.push(tag.name)
      })
    }
  }

  // Add author names
  if (data.authors && Array.isArray(data.authors) && data.authors.length > 0) {
    const authorIds = data.authors
      .map((author) => (typeof author === 'string' ? author : author.id))
      .filter((id): id is string => !!id)

    if (authorIds.length > 0) {
      const { docs: authors } = await req.payload.find({
        collection: 'profiles',
        where: {
          id: {
            in: authorIds
          }
        },
        depth: 0,
        limit: 100,
        pagination: false
      })
      authors.forEach((author) => {
        if (author.name) searchableParts.push(author.name)
      })
    }
  }

  // Add contributor names from contributions array
  if (
    data.contributions &&
    Array.isArray(data.contributions) &&
    data.contributions.length > 0
  ) {
    const contributorIds = data.contributions
      .map((contribution) => {
        if (!contribution.profile) return null
        return typeof contribution.profile === 'string'
          ? contribution.profile
          : contribution.profile.id
      })
      .filter((id): id is string => !!id)

    if (contributorIds.length > 0) {
      const { docs: contributors } = await req.payload.find({
        collection: 'profiles',
        where: {
          id: {
            in: contributorIds
          }
        },
        depth: 0,
        limit: 100,
        pagination: false
      })
      contributors.forEach((contributor) => {
        if (contributor.name) searchableParts.push(contributor.name)
      })
    }
  }

  // Combine all searchable text, remove duplicates, and join with ' | ' separator
  // The separator prevents false matches across field boundaries (e.g., "book" + "mark" != "bookmark")
  const uniqueParts = Array.from(new Set(searchableParts))

  // @ts-expect-error - searchText will be added to schema after regeneration
  data.searchText = uniqueParts.join(' | ')

  return data
}
