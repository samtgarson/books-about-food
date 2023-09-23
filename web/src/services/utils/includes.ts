import { Prisma } from 'database'

export const profileIncludes = {
  user: { select: { image: true } },
  avatar: true,
  _count: { select: { authoredBooks: true } }
} satisfies Prisma.ProfileDefaultArgs['include']

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
  publisher: { include: { logo: true } },
  tags: true,
  links: { orderBy: { site: 'asc' } }
} satisfies Prisma.BookDefaultArgs['include']
