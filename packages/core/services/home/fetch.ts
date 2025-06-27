import { Book } from '@books-about-food/core/models/book'
import { Profile } from '@books-about-food/core/models/profile'
import { Publisher } from '@books-about-food/core/models/publisher'
import { Service } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import { z } from 'zod'
import { bookIncludes, profileIncludes, publisherIncludes } from '../utils'

export async function fetchComingSoon() {
  const raw = await prisma.book.findMany({
    where: { releaseDate: { gte: new Date() }, status: 'published' },
    orderBy: { releaseDate: 'asc' },
    take: 10,
    include: bookIncludes
  })
  return raw.map((book) => new Book(book))
}

export async function fetchNewlyAdded() {
  const raw = await prisma.book.findMany({
    where: { releaseDate: { lt: new Date() }, status: 'published' },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: bookIncludes
  })
  return raw.map((book) => new Book(book))
}

export async function fetchFeaturedProfiles() {
  const raw = await prisma.profile.findMany({
    orderBy: { createdAt: 'desc' },
    where: {
      OR: [
        { features: { some: { until: null } } },
        { features: { some: { until: { gte: new Date() } } } }
      ]
    },
    take: 10,
    include: profileIncludes
  })
  return raw.map((profile) => new Profile(profile))
}

export async function fetchPublishers() {
  const raw = await prisma.publisher.findMany({
    orderBy: [
      { logo: { publisher: { books: { _count: 'desc' } } } },
      { books: { _count: 'desc' } }
    ],
    take: 12,
    include: publisherIncludes
  })
  return raw.map((publisher) => new Publisher(publisher))
}

export const fetchHome = new Service(z.object({}), async () => {
  const [comingSoon, newlyAdded, people, publishers] = await Promise.all([
    fetchComingSoon(),
    fetchNewlyAdded(),
    fetchFeaturedProfiles(),
    fetchPublishers()
  ])

  return { comingSoon, newlyAdded, publishers, people }
})
