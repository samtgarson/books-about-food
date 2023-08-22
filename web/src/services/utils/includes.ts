import { Prisma } from 'database'

export const profileIncludes = {
  user: { select: { image: true } },
  avatar: true
} satisfies Prisma.ProfileDefaultArgs['include']

export const bookIncludes = {
  coverImage: true,
  previewImages: { orderBy: { createdAt: 'asc' } },
  publisher: { include: { logo: true } },
  tags: true,
  links: { orderBy: { site: 'asc' } },
  authors: { include: profileIncludes },
  contributions: {
    distinct: ['profileId'],
    where: { NOT: { job: { name: { startsWith: 'Author' } } } },
    include: {
      profile: { include: profileIncludes },
      job: true
    }
  }
} satisfies Prisma.BookDefaultArgs['include']
