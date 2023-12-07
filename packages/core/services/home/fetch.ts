import { Book } from '@books-about-food/core/models/book'
import { Profile } from '@books-about-food/core/models/profile'
import { Publisher } from '@books-about-food/core/models/publisher'
import { Service } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import { z } from 'zod'
import { bookIncludes, profileIncludes, publisherIncludes } from '../utils'

export const fetchHome = new Service(z.object({}), async () => {
  const [comingSoon, newlyAdded, authors, publishers] = await Promise.all([
    // coming soon
    prisma.book
      .findMany({
        where: { releaseDate: { gte: new Date() }, status: 'published' },
        orderBy: { releaseDate: 'asc' },
        take: 10,
        include: bookIncludes
      })
      .then((books) => books.map((book) => new Book(book))),

    // newly added
    prisma.book
      .findMany({
        where: { releaseDate: { lt: new Date() }, status: 'published' },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: bookIncludes
      })
      .then((books) => books.map((book) => new Book(book))),

    // featured profiles
    prisma.profile
      .findMany({
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
      .then((profiles) => profiles.map((profile) => new Profile(profile))),

    // publishers
    prisma.publisher
      .findMany({
        orderBy: [
          { logo: { publisher: { books: { _count: 'desc' } } } },
          { books: { _count: 'desc' } }
        ],
        take: 12,
        include: publisherIncludes
      })
      .then((publishers) =>
        publishers.map((publisher) => new Publisher(publisher))
      )
  ])

  return { comingSoon, newlyAdded, publishers, authors }
})
