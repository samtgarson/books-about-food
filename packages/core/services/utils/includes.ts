import { Prisma } from '@books-about-food/database'

export const profileIncludes = {
  avatar: true,
  _count: { select: { authoredBooks: true } }
} satisfies Prisma.ProfileDefaultArgs['include']

export const publisherIncludes = {
  logo: true,
  imprints: { select: { name: true, slug: true } },
  house: { select: { name: true, slug: true } }
}

export const bookIncludes = {
  coverImage: true,
  authors: { include: profileIncludes },
  contributions: {
    where: { NOT: { job: { name: { startsWith: 'Author' } } } },
    include: {
      profile: { include: profileIncludes },
      job: true
    }
  }
} satisfies Prisma.BookDefaultArgs['include']

export const fullBookIncludes = {
  ...bookIncludes,
  previewImages: { orderBy: { createdAt: 'asc' } },
  publisher: { include: publisherIncludes },
  tags: true,
  links: { orderBy: { site: 'asc' } }
} satisfies Prisma.BookDefaultArgs['include']
