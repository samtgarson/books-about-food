import prisma from 'database'
import { Book } from 'src/models/book'
import { Profile } from 'src/models/profile'
import { Publisher } from 'src/models/publisher'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { bookIncludes, profileIncludes } from '../utils'

export const fetchHome = new Service(z.object({}), async () => {
  const [comingSoon, newlyAdded, authors, people, publishers] =
    await Promise.all([
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
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: bookIncludes
        })
        .then((books) => books.map((book) => new Book(book))),

      prisma.profile
        .findMany({
          where: { contributions: { some: { job: { name: 'Author' } } } },
          orderBy: { createdAt: 'desc' },
          take: 8,
          include: profileIncludes
        })
        .then((profiles) => profiles.map((profile) => new Profile(profile))),

      prisma.profile
        .findMany({
          where: { contributions: { none: { job: { name: 'Author' } } } },
          orderBy: { createdAt: 'desc' },
          take: 14,
          include: profileIncludes
        })
        .then((profiles) => profiles.map((profile) => new Profile(profile))),

      prisma.publisher
        .findMany({
          orderBy: { createdAt: 'desc' },
          take: 25,
          include: { logo: true }
        })
        .then((publishers) =>
          publishers.map((publisher) => new Publisher(publisher))
        )
    ])

  return { comingSoon, newlyAdded, authors, people, publishers }
})
