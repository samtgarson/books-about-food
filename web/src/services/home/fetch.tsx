import prisma from 'database'
import { Book } from 'src/models/book'
import { Profile } from 'src/models/profile'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { bookIncludes, profileIncludes } from '../utils'

export const fetchHome = new Service(z.object({}), async () => {
  const [comingSoon, newlyAdded, people, publishers] = await Promise.all([
    prisma.book
      .findMany({
        where: { releaseDate: { gte: new Date() } },
        orderBy: { releaseDate: 'asc' },
        take: 10,
        include: bookIncludes
      })
      .then((books) => books.map((book) => new Book(book))),

    prisma.book
      .findMany({
        where: { releaseDate: { lt: new Date() } },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: bookIncludes
      })
      .then((books) => books.map((book) => new Book(book))),

    prisma.profile
      .findMany({
        orderBy: { createdAt: 'desc' },
        take: 14,
        include: profileIncludes
      })
      .then((profiles) => profiles.map((profile) => new Profile(profile))),

    prisma.publisher.findMany({
      orderBy: { createdAt: 'desc' },
      take: 12,
      include: { logo: true }
    })
  ])

  return { comingSoon, newlyAdded, people, publishers }
})
