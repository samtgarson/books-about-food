import prisma, { cacheStrategy } from 'database'
import { Book } from 'src/models/book'
import { Profile } from 'src/models/profile'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { bookIncludes, profileIncludes } from '../utils'

export const fetchHome = new Service(z.object({}), async () => {
  const [comingSoon, newlyAdded, authors, people, publishers] =
    await Promise.all([
      // coming soon
      prisma.book
        .findMany({
          cacheStrategy,
          where: { releaseDate: { gte: new Date() }, status: 'published' },
          orderBy: { releaseDate: 'asc' },
          take: 10,
          include: bookIncludes
        })
        .then((books) => books.map((book) => new Book(book))),

      // newly added
      prisma.book
        .findMany({
          cacheStrategy,
          where: { releaseDate: { lt: new Date() }, status: 'published' },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: bookIncludes
        })
        .then((books) => books.map((book) => new Book(book))),

      // featured profiles
      prisma.profile
        .findMany({
          cacheStrategy,
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

      // recent profiles
      prisma.profile
        .findMany({
          cacheStrategy,
          orderBy: { createdAt: 'desc' },
          where: { contributions: { some: {} } },
          take: 14,
          include: profileIncludes
        })
        .then((profiles) => profiles.map((profile) => new Profile(profile))),

      // publishers
      prisma.publisher.findMany({
        cacheStrategy,
        orderBy: { createdAt: 'desc' },
        take: 12,
        include: { logo: true }
      })
    ])

  return { comingSoon, newlyAdded, people, publishers, authors }
})
