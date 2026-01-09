import { BasePayload } from 'payload'
import { Book } from 'src/core/models/book'
import { Profile } from 'src/core/models/profile'
import { Publisher } from 'src/core/models/publisher'
import { Service } from 'src/core/services/base'
import { Profile as PayloadProfile } from 'src/payload/payload-types'
import { z } from 'zod'
import {
  BOOK_DEPTH,
  PROFILE_DEPTH,
  PUBLISHER_DEPTH
} from '../utils/payload-depth'

export async function fetchComingSoon(payload: BasePayload) {
  const now = new Date().toISOString()
  const { docs } = await payload.find({
    collection: 'books',
    where: {
      and: [
        { releaseDate: { greater_than_equal: now } },
        { status: { equals: 'published' } }
      ]
    },
    sort: 'releaseDate',
    limit: 10,
    depth: BOOK_DEPTH
  })
  return docs.map((book) => new Book(book))
}

export async function fetchNewlyAdded(payload: BasePayload) {
  const now = new Date().toISOString()
  const { docs } = await payload.find({
    collection: 'books',
    where: {
      and: [
        { releaseDate: { less_than: now } },
        { status: { equals: 'published' } }
      ]
    },
    sort: '-createdAt',
    limit: 10,
    depth: BOOK_DEPTH
  })
  return docs.map((book) => new Book(book))
}

export async function fetchFeaturedProfiles(payload: BasePayload) {
  const now = new Date().toISOString()
  const { docs } = await payload.find({
    collection: 'featured-profiles',
    where: {
      or: [{ until: { exists: false } }, { until: { greater_than_equal: now } }]
    },
    // sort: '-createdAt',
    limit: 10,
    depth: PROFILE_DEPTH + 1 // +1 to populate the profile relationship
  })
  return docs.map(({ profile }) => new Profile(profile as PayloadProfile))
}

export async function fetchPublishers(payload: BasePayload) {
  // Fetch publishers with books relationship populated
  const { docs } = await payload.find({
    collection: 'publishers',
    limit: 50, // Fetch more than needed to sort
    depth: PUBLISHER_DEPTH
  })

  // Sort by book count in JS (Payload doesn't support aggregation sorting)
  const sorted = docs
    .map((pub) => ({
      pub,
      bookCount: Array.isArray(pub.books) ? pub.books.length : 0
    }))
    .sort((a, b) => b.bookCount - a.bookCount)
    .slice(0, 12)
    .map(({ pub }) => new Publisher(pub))

  return sorted
}

export const fetchHome = new Service(
  z.undefined(),
  async (_input, { payload }) => {
    const [comingSoon, newlyAdded, people, publishers] = await Promise.all([
      fetchComingSoon(payload),
      fetchNewlyAdded(payload),
      fetchFeaturedProfiles(payload),
      fetchPublishers(payload)
    ])

    return { comingSoon, newlyAdded, publishers, people }
  }
)
